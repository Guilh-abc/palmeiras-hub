/**
 * Filtro de notícia, desfalque, fase da Copa e sync expirado.
 * Run: node scripts/assert-review.mjs
 */
import { keepNewsItem } from '../src/api/sources/news.js'
import { buildCopaDoBrasilPath } from '../src/api/sources/hub.js'
import { isPalmeirasSquadNews } from '../src/utils/availability.js'
import {
  DEFAULT_INSTANT_APP_ID,
  isInstantExpiredAt,
} from '../src/sync/instantExpiry.js'

function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exitCode = 1
  } else {
    console.log('OK:', msg)
  }
}

const lance = { name: 'Lance!', clubFeed: false }
const gazeta = { name: 'Gazeta Esportiva', clubFeed: true }

assert(
  keepNewsItem(lance, { title: 'Manchester United anuncia Pochettino' }) === false,
  'Lance sem Palmeiras no título fica de fora'
)
assert(
  keepNewsItem(lance, { title: 'Palmeiras enfrenta o Cruzeiro no Mineirão' }) === true,
  'Lance com Palmeiras no título entra'
)
assert(
  keepNewsItem(gazeta, { title: 'Treino desta sexta na Academia' }) === true,
  'Feed do clube entra mesmo sem a palavra no título'
)

assert(
  isPalmeirasSquadNews('Vasco tem quatro desfalques para a Chapecoense') === false,
  'Desfalque de outro time não entra'
)
assert(
  isPalmeirasSquadNews('Flamengo negocia suspensão de contrato com a Betano') === false,
  'Suspensão de contrato não é desfalque'
)
assert(
  isPalmeirasSquadNews('Palmeiras tem desfalque de última hora contra o Cruzeiro') === true,
  'Desfalque do Palmeiras entra'
)
assert(
  isPalmeirasSquadNews('Ex-Palmeiras, Bruno Tabata projeta retorno após cirurgia') === false,
  'Ex-jogador não entra como desfalque'
)
assert(
  isPalmeirasSquadNews('Palmeiras prepara mudanças', 'o texto cita desfalque só no resumo') === false,
  'Palavra só no resumo não conta'
)

const copa = buildCopaDoBrasilPath(
  [],
  [
    {
      id: 'cdb-1',
      competitionCode: 'CDB',
      status: 'SCHEDULED',
      opponent: 'Flamengo',
      date: '2026-11-20T22:00:00Z',
    },
  ],
  []
)
assert(copa.note.includes('Mata-mata vs Flamengo'), `fase da Copa → ${copa.note}`)
assert(!copa.note.includes('Semifinal'), 'Copa não inventa semifinal')

const afterExpiry = Date.parse('2026-11-13T12:00:00Z')
assert(
  isInstantExpiredAt(afterExpiry, DEFAULT_INSTANT_APP_ID) === true,
  'App padrão expirado em novembro de 2026'
)
assert(
  isInstantExpiredAt(afterExpiry, '11111111-1111-1111-1111-111111111111') === false,
  'App próprio não usa a data do app padrão'
)

if (process.exitCode) {
  console.error('assert-review: falhou')
} else {
  console.log('assert-review: ok')
}
