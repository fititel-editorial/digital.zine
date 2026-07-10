import { useAuth } from '../../context/AuthContext'
import { MOCK_METRICS } from '../../data/mockAdmin'

const MetricCard = ({ label, value, sub, accent }) => (
  <div className="ad-card">
    <span className="ad-card__label">{label}</span>
    <span className="ad-card__value" style={accent ? { color: 'var(--accent-terminal)' } : {}}>{value}</span>
    {sub && <span className="ad-card__sub">{sub}</span>}
    <span className="ad-card__bar"><span className="ad-card__bar-fill" style={{ width: '100%' }}></span></span>
  </div>
)

const Dashboard = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const m = MOCK_METRICS

  return (
    <div className="ad-dashboard">
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">Dashboard</h1>
          <p className="ad-page-desc">Metricas do sistema FITITEL</p>
        </div>
      </div>

      <div className="ad-metrics">
        <MetricCard label="Edicoes Publicadas" value={m.totalEditions} sub="5 este ano" />
        {isAdmin && (
          <MetricCard label="Editores Ativos" value={`${m.activeEditors}/${m.totalEditors}`} sub={`${m.totalEditors - m.activeEditors} inativos`} />
        )}
        <MetricCard label="Total de Leitores" value={m.totalReaders.toLocaleString()} sub={`${m.activeSubscribers.toLocaleString()} subscritores`} />
        {isAdmin && (
          <MetricCard label="Receita Total" value={`AKZ ${m.totalRevenue.toLocaleString()}`} sub={`AKZ ${m.revenueThisMonth.toLocaleString()} este mes`} accent />
        )}
        <MetricCard label="Classificacao Media" value={m.avgRating} sub="/ 5.0" />
        <MetricCard label="Resumo Rapido" value="Operacional" sub="Sistema sem anomalias" />
      </div>
    </div>
  )
}

export default Dashboard
