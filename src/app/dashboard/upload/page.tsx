'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Upload, FileText, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const ACCEPTED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
  '', // Algumas extensões como .md podem vir com MIME type vazio dependendo do OS
];

const TYPE_LABELS: Record<string, string> = {
  'application/pdf': 'PDF',
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'text/plain': 'TXT',
  'text/markdown': 'MD',
  '': 'MD/TXT',
};

interface UploadedFile {
  file: File;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [docType, setDocType] = useState('contrato');
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList)
      .filter(f => ACCEPTED_TYPES.includes(f.type) || f.name.endsWith('.md'))
      .map(f => ({ file: f, status: 'idle' as const }));

    if (newFiles.length < fileList.length) {
      alert('Alguns arquivos foram ignorados (tipo não suportado). Aceitos: PDF, JPEG, PNG, DOC, DOCX, TXT, MD.');
    }

    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    for (let i = 0; i < files.length; i++) {
      setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'uploading' } : f));

      try {
        const file = files[i].file;
        const filePath = `${user.id}/${Date.now()}_${file.name}`;

        // Upload para o Storage
        const { error: storageError } = await supabase.storage
          .from('contracts')
          .upload(filePath, file, { contentType: file.type, upsert: false });

        if (storageError) throw storageError;

        // Criar registro no banco
        const { error: dbError } = await supabase.from('documents').insert({
          user_id: user.id,
          title: file.name.replace(/\.[^.]+$/, ''),
          doc_type: docType,
          file_path: filePath,
          file_size: file.size,
          status: 'uploaded',
        });

        if (dbError) throw dbError;

        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'success' } : f));
      } catch (err: any) {
        setFiles(prev => prev.map((f, idx) =>
          idx === i ? { ...f, status: 'error', error: err.message || 'Erro no upload' } : f
        ));
      }
    }

    setUploading(false);
    
    setTimeout(() => {
      // Remove da lista os arquivos que tiveram sucesso
      setFiles(prev => prev.filter(f => f.status !== 'success'));
      
      // Se todos tiveram sucesso, volta pra página de documentos
      const allSuccess = files.every(f => f.status === 'success');
      if (allSuccess) router.push('/dashboard/documents');
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Upload de Documentos</h1>
        <p className="mt-1 text-sm text-slate-400">
          Envie contratos, termos ou políticas para análise inteligente.
        </p>
      </div>

      {/* Tipo do documento */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Tipo de documento</label>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3 text-white
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
        >
          <option value="contrato">📄 Contrato</option>
          <option value="termo">📋 Termo de Uso/Serviço</option>
          <option value="politica">🔒 Política de Privacidade</option>
          <option value="procuracao">✍️ Procuração</option>
          <option value="peticao">⚖️ Petição</option>
          <option value="prontuario">🩺 Prontuário</option>
          <option value="analise">📊 Análise</option>
          <option value="outro">📎 Outro</option>
        </select>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300
          ${dragOver
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]'
            : 'border-slate-700 bg-slate-900/30 hover:border-slate-600 hover:bg-slate-900/50'
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt,.md"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <div className={`flex items-center justify-center w-14 h-14 rounded-2xl mb-4 transition-colors
          ${dragOver ? 'bg-indigo-500/20' : 'bg-slate-800'}`}>
          <Upload className={`h-7 w-7 ${dragOver ? 'text-indigo-400' : 'text-slate-400'}`} />
        </div>
        <p className="text-sm font-medium text-white mb-1">
          Arraste arquivos aqui ou <span className="text-indigo-400">clique para selecionar</span>
        </p>
        <p className="text-xs text-slate-500">
          PDF, JPEG, PNG, DOC, DOCX, TXT, MD • Máx. 50 MB por arquivo
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-300">
            {files.length} arquivo{files.length > 1 ? 's' : ''} selecionado{files.length > 1 ? 's' : ''}
          </h3>
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-500/10">
                <FileText className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{f.file.name}</p>
                <p className="text-xs text-slate-500">
                  {TYPE_LABELS[f.file.type] || 'Arquivo'} • {formatSize(f.file.size)}
                </p>
              </div>
              {f.status === 'idle' && (
                <button onClick={() => removeFile(i)} className="text-slate-500 hover:text-red-400 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              )}
              {f.status === 'uploading' && <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />}
              {f.status === 'success' && <CheckCircle className="h-4 w-4 text-emerald-400" />}
              {f.status === 'error' && (
                <span className="flex items-center gap-1 text-xs text-red-400">
                  <AlertCircle className="h-3 w-3" /> {f.error}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={uploading || files.every(f => f.status === 'success')}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-white font-semibold 
            hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 shadow-lg shadow-indigo-500/25"
        >
          {uploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Enviando...
            </>
          ) : files.every(f => f.status === 'success') ? (
            <>
              <CheckCircle className="h-5 w-5" />
              Enviado com sucesso!
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              Enviar {files.length} arquivo{files.length > 1 ? 's' : ''}
            </>
          )}
        </button>
      )}
    </div>
  );
}
