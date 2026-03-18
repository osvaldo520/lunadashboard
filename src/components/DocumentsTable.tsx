'use client';

import { FileText } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Document {
  id: string;
  title: string;
  doc_type: string;
  status: string;
  risk_score: number | null;
  created_at: string;
}

interface DocumentsTableProps {
  documents: Document[];
}

export function DocumentsTable({ documents: initialDocuments }: DocumentsTableProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const supabase = createClient();

  // Sync state if server component params change (pagination, search)
  useEffect(() => {
    setDocuments(initialDocuments);
  }, [initialDocuments]);

  // Subscribe to realtime changes in documents table
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'documents' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newDoc = payload.new as Document;
            setDocuments((current) => [newDoc, ...current]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedDoc = payload.new as Document;
            setDocuments((current) =>
              current.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc))
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedDocId = payload.old.id;
            setDocuments((current) => current.filter((doc) => doc.id !== deletedDocId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-slate-700 bg-slate-900/20">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 mb-6">
          <FileText className="h-8 w-8 text-indigo-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Nenhum documento encontrado</h3>
        <p className="text-sm text-slate-400 max-w-sm text-center mb-6">
          Nenhum contrato corresponde aos seus filtros de busca ou nada foi enviado ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Título</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tipo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Risco</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-slate-800/30 transition-colors group">
              <td className="px-6 py-4">
                <Link href={`/dashboard/documents/${doc.id}`} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                    <FileText className="h-4 w-4 text-indigo-400" />
                  </div>
                  <span className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors">{doc.title}</span>
                </Link>
              </td>
              <td className="px-6 py-4 text-sm text-slate-400 capitalize">{doc.doc_type || '—'}</td>
              <td className="px-6 py-4">
                <StatusBadge status={doc.status} />
              </td>
              <td className="px-6 py-4">
                {doc.risk_score != null ? (
                  <RiskIndicator score={doc.risk_score} />
                ) : (
                  <span className="text-sm text-slate-600">—</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-slate-400">
                {new Date(doc.created_at).toLocaleDateString('pt-BR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    uploaded: 'bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/20',
    pending: 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
    analyzing: 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20',
    completed: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
    error: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
  };

  const labels: Record<string, string> = {
    uploaded: 'Enviado',
    pending: 'Pendente',
    analyzing: 'Analisando',
    completed: 'Concluído',
    error: 'Erro',
  };

  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status] || styles.pending} transition-colors duration-300`}>
      {labels[status] || status}
    </span>
  );
}

function RiskIndicator({ score }: { score: number }) {
  let color = 'bg-emerald-500'; // Risco Leve (0-29)
  if (score >= 75) color = 'bg-red-500'; // Risco Fatal (75-100)
  else if (score >= 50) color = 'bg-orange-500'; // Risco Importante (50-74)
  else if (score >= 30) color = 'bg-amber-400'; // Risco Geral (30-49)

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-slate-700 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-medium text-slate-400">{score}%</span>
    </div>
  );
}
