const dashboardRepository = require("../repositories/dashboardRepository")

class DashboardService {
  async getCoachDashboard(coachId) {
    const [totalStudents, activeProtocols, recentStudents, newRegistrations] = await Promise.all([
      dashboardRepository.getTotalStudents(coachId),
      dashboardRepository.getActiveProtocols(coachId),
      dashboardRepository.getRecentStudents(coachId, 5),
      dashboardRepository.getNewRegistrations(coachId, 30),
    ])

    return {
      indicators: {
        totalStudents,
        activeProtocols,
        newRegistrations: newRegistrations.length,
      },
      recentStudents,
      newRegistrations,
    }
  }

  async getStudentStats(coachId, period) {
    const stats = await dashboardRepository.getStudentStatsByPeriod(coachId, period)
    return stats
  }

  async getRecentStudents(coachId, limit) {
    return await dashboardRepository.getRecentStudents(coachId, limit)
  }
}

module.exports = new DashboardService()
