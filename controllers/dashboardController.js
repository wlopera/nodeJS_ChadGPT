const DashboardService = require("../services/dashboardService");
const dashboardService = new DashboardService();

exports.getDashboard = async (req, res) => {
  try {
    const user = req.user; // viene del middleware JWT
    const data = await dashboardService.getDashboardData(user);
    res.status(200).json({ dashboard: data });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener dashboard", details: err });
  }
};
