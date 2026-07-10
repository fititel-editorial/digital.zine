import { MOCK_REVENUE } from '../../data/mockAdmin'

const maxRevenue = Math.max(...MOCK_REVENUE.byEdition.map((r) => r.revenue))
const maxMonthly = Math.max(...MOCK_REVENUE.monthly.map((r) => r.revenue))

const Reports = () => {
  const totalRevenue = MOCK_REVENUE.byEdition.reduce((s, r) => s + r.revenue, 0)
  const totalSales = MOCK_REVENUE.byEdition.reduce((s, r) => s + r.sales, 0)

  return (
    <div className="ad-editions">
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">Relatorios Financeiros</h1>
          <p className="ad-page-desc">Receitas e metricas de vendas</p>
        </div>
        <div className="ad-page-stats">
          <span className="ad-page-stat">
            <strong>AKZ {totalRevenue.toLocaleString()}</strong> Total
          </span>
          <span className="ad-page-stat">
            <strong>{totalSales}</strong> Vendas
          </span>
        </div>
      </div>

      <div className="ad-table-wrap">
        <h3 className="ad-table-title">Receita por Edicao</h3>
        <table className="ad-table">
          <thead>
            <tr>
              <th>Edicao</th>
              <th>Periodo</th>
              <th>Vendas</th>
              <th>Receita</th>
              <th>Variacao</th>
              <th>Barra</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_REVENUE.byEdition.map((r) => (
              <tr key={r.vol}>
                <td>
                  <span className="ad-table__mono">Vol. {r.vol}</span>
                  <span className="ad-table__sub">{r.title.length > 28 ? r.title.slice(0, 28) + '...' : r.title}</span>
                </td>
                <td className="ad-table__mono">{r.period}</td>
                <td className="ad-table__mono">{r.sales}</td>
                <td className="ad-table__mono ad-table__mono--accent">AKZ {r.revenue.toLocaleString()}</td>
                <td>
                  <span className={`ad-growth ${r.growth >= 0 ? 'ad-growth--up' : 'ad-growth--down'}`}>
                    {r.growth >= 0 ? '+' : ''}{r.growth}%
                  </span>
                </td>
                <td className="ad-table__bar-cell">
                  <span className="ad-table__bar">
                    <span className="ad-table__bar-fill" style={{ width: `${(r.revenue / maxRevenue) * 100}%` }}></span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ad-table-wrap" style={{ marginTop: 32 }}>
        <h3 className="ad-table-title">Receita Mensal</h3>
        <table className="ad-table">
          <thead>
            <tr>
              <th>Mes</th>
              <th>Receita</th>
              <th>Subscritores</th>
              <th>Barra</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_REVENUE.monthly.map((r) => (
              <tr key={r.month}>
                <td className="ad-table__mono">{r.month}</td>
                <td className="ad-table__mono ad-table__mono--accent">AKZ {r.revenue.toLocaleString()}</td>
                <td className="ad-table__mono">{r.subscribers}</td>
                <td className="ad-table__bar-cell">
                  <span className="ad-table__bar">
                    <span className="ad-table__bar-fill" style={{ width: `${(r.revenue / maxMonthly) * 100}%` }}></span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Reports
