import { AppState } from '../types';

export function generateMasteryCertificate(state: AppState): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background - Deep Space Gradient
  const grad = ctx.createLinearGradient(0, 0, 1200, 800);
  grad.addColorStop(0, '#0a0e1a');
  grad.addColorStop(0.5, '#111827');
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 800);

  // Outer Border (Gold / Cyan)
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 8;
  ctx.strokeRect(30, 30, 1140, 740);

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.strokeRect(45, 45, 1110, 710);

  // Corner Ornaments
  const drawCorner = (x: number, y: number) => {
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
  };
  drawCorner(55, 55);
  drawCorner(1145, 55);
  drawCorner(55, 745);
  drawCorner(1145, 745);

  // Header Title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#a78bfa';
  ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('BANGLADESH HSC ENGLISH 2ND PAPER CURRICULUM', 600, 115);

  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'bold 42px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('CERTIFICATE OF GRAMMAR MASTERY', 600, 175);

  ctx.fillStyle = '#22d3ee';
  ctx.font = '16px "JetBrains Mono", monospace';
  ctx.fillText('★ OFFICIAL BOARD STANDARD ACHIEVEMENT ★', 600, 215);

  // Divider Line
  const lineGrad = ctx.createLinearGradient(300, 235, 900, 235);
  lineGrad.addColorStop(0, 'rgba(34,211,238,0)');
  lineGrad.addColorStop(0.5, '#22d3ee');
  lineGrad.addColorStop(1, 'rgba(34,211,238,0)');
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(300, 235);
  ctx.lineTo(900, 235);
  ctx.stroke();

  // Recipient Text
  ctx.fillStyle = '#94a3b8';
  ctx.font = '18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('This is proudly awarded to', 600, 280);

  // Student Name
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 46px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(state.user.name || 'HSC Scholar', 600, 340);

  // Roll, Institute, Board, Group details
  const rollText = state.user.roll ? `Roll ID: ${state.user.roll} • ` : '';
  const instText = state.user.institute ? `${state.user.institute} • ` : '';
  const boardGroupText = `${rollText}${instText}${state.user.group || 'Science'} • ${state.user.board || 'Dhaka'} Board`;
  ctx.fillStyle = '#38bdf8';
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.fillText(boardGroupText, 600, 385);

  // Rank / Title
  ctx.fillStyle = '#a78bfa';
  ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Academic Title: ${state.user.title || 'Apprentice'} (Level ${state.level})`, 600, 420);

  // Body Description
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '17px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('for demonstrating exceptional mastery across the 60-mark Grammar syllabus,', 600, 470);
  ctx.fillText('including Voice Transformations, Narration, 16 Affirmative Rules,', 600, 500);
  ctx.fillText('Complex Clauses, Modifiers, and Board Standard Exercises.', 600, 530);

  // Stats Grid
  const totalCorrect = Object.values(state.topicProgress).reduce((a, b) => a + (b.correct || 0), 0);
  const avgMastery = Math.round(
    Object.values(state.topicProgress).reduce((a, b) => a + (b.mastery || 0), 0) /
      Math.max(1, Object.keys(state.topicProgress).length)
  );

  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  ctx.roundRect(220, 570, 760, 85, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#22d3ee';
  ctx.font = 'bold 24px "JetBrains Mono", monospace';
  ctx.fillText(`${state.xp} XP`, 340, 610);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Total Experience', 340, 635);

  ctx.fillStyle = '#a3e635';
  ctx.font = 'bold 24px "JetBrains Mono", monospace';
  ctx.fillText(`${totalCorrect} Questions`, 600, 610);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Correct Answers', 600, 635);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 24px "JetBrains Mono", monospace';
  ctx.fillText(`${avgMastery}%`, 860, 610);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Curriculum Mastery', 860, 635);

  // Footer Date & Seal
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748b';
  ctx.font = '15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Issued on: ${dateStr}`, 80, 715);
  ctx.fillText('Verification ID: HSC-GQ-' + (state.user.roll ? state.user.roll : Math.random().toString(36).substring(2, 9).toUpperCase()), 80, 740);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#a78bfa';
  ctx.font = 'bold 17px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('HSC Grammar Quest Academic Board', 1120, 715);
  ctx.fillStyle = '#64748b';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Bangladesh Education Boards Aligned', 1120, 740);

  return canvas.toDataURL('image/png');
}

export function downloadCertificatePNG(state: AppState): void {
  const dataUrl = generateMasteryCertificate(state);
  if (!dataUrl) return;

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `HSC_Grammar_Mastery_Certificate_${state.user.name.replace(/\s+/g, '_')}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
