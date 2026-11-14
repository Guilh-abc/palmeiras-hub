/**
 * Aviso único quando o app InstantDB padrão já expirou.
 * Palpite, mural, reações e quiz não são montados nesse estado.
 */
export default function SyncPaused() {
  return (
    <p className="sync-status__warn muted tiny" role="status">
      Sala entre celulares pausada. O sync expirou em 01/10/2026 e nada é enviado.
      Para religar, crie um app InstantDB free e defina VITE_INSTANT_APP_ID no build.
    </p>
  )
}
