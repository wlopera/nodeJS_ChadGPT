class DashboardService {
  constructor() {
    // Aquí podrías inicializar datos o conectarte a la DB en el futuro
  }

  // Método para obtener datos del dashboard
  getDashboardData(user) {
    // Por ahora mock de datos
    return new Promise((resolve) => {
      const data = {
        welcomeMessage: `Bienvenido al dashboard, ${user.username}!`,
        stats: {
          posts: 12,
          comments: 34,
          likes: 56,
        },
      };
      resolve(data);
    });
  }
}

module.exports = DashboardService;
