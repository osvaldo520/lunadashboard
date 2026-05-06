import { createClient } from '@/lib/supabase/client';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  files?: { filename: string; mimeType: string; base64: string }[];
}

export interface ChatResponse {
  success: boolean;
  data: {
    response: string;
    files: { filename: string; mimeType: string; base64: string }[];
    error: boolean;
  };
}

/**
 * ChatService — Client-side service for Dashboard Chat.
 * Communicates via Supabase Realtime Queue.
 */
export class ChatService {
  /**
   * Send a message (and optional file) via Supabase queue.
   */
  static async sendMessage(message: string, file?: File): Promise<ChatResponse> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      throw new Error('Not authenticated. Please log in.');
    }

    const userId = session.user.id;
    let filePath: string | null = null;

    // 1. Upload file if exists
    if (file) {
      filePath = `${userId}/chat_files/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('contracts')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
    }

    // 2. Insert into queue
    const { data: queueRow, error: insertError } = await supabase
      .from('dashboard_chat_queue')
      .insert({
        user_id: userId,
        message,
        file_path: filePath,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError || !queueRow) {
      throw new Error(`Failed to queue message: ${insertError?.message}`);
    }

    // 3. Wait for response via Realtime
    return new Promise((resolve, reject) => {
      // Timeout after 2 minutes
      const timeout = setTimeout(() => {
        supabase.removeChannel(channel);
        reject(new Error('Timeout waiting for Judite response.'));
      }, 120000);

      const channel = supabase.channel(`chat_queue_${queueRow.id}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'dashboard_chat_queue',
          filter: `id=eq.${queueRow.id}`
        }, (payload) => {
          const updatedRow = payload.new;
          
          if (updatedRow.status === 'completed') {
            clearTimeout(timeout);
            supabase.removeChannel(channel);
            resolve({
              success: true,
              data: {
                response: updatedRow.response_text || '(Sem resposta)',
                files: updatedRow.response_files || [],
                error: false
              }
            });
          } else if (updatedRow.status === 'error') {
            clearTimeout(timeout);
            supabase.removeChannel(channel);
            reject(new Error(updatedRow.error_message || 'Error processing message.'));
          }
        })
        .subscribe((status, err) => {
          if (status === 'CHANNEL_ERROR') {
            clearTimeout(timeout);
            reject(new Error('Failed to subscribe to chat queue.'));
          }
        });
    });
  }

  /**
   * Get chat history from unified Supabase 'messages' table.
   */
  static async getHistory(limit = 50): Promise<ChatMessage[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Find the latest conversation
    const { data: convData } = await supabase
      .from('conversations')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!convData) return [];

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', convData.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    // Reverse to chronological order
    return data.reverse().map((msg: any) => ({
      id: msg.id.toString(),
      role: msg.role,
      content: msg.content,
      created_at: msg.created_at,
    }));
  }

  /**
   * Download a file from base64 data.
   */
  static downloadFile(file: { filename: string; mimeType: string; base64: string }) {
    try {
      // Clean the base64 string (remove possible data URI prefix, whitespace, etc.)
      let cleanBase64 = file.base64;
      if (cleanBase64.includes(',')) {
        cleanBase64 = cleanBase64.split(',')[1];
      }
      cleanBase64 = cleanBase64.replace(/\s/g, '');

      // Use fetch + data URI for robust base64 decoding (handles padding issues)
      fetch(`data:${file.mimeType};base64,${cleanBase64}`)
        .then(res => res.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.filename;
          a.click();
          URL.revokeObjectURL(url);
        })
        .catch(err => {
          console.error('Download failed:', err);
          alert('Erro ao baixar o arquivo. Tente novamente.');
        });
    } catch (err) {
      console.error('Download error:', err);
      alert('Erro ao processar o arquivo para download.');
    }
  }
}
