// src/controllers/dashboardController.js (CORREÇÃO COMPLETA)

const dashboardService = require("../services/dashboardService")

class DashboardController {
  async getCoachDashboard(req, res, next) {
    try {
      // CORRIGIDO: Usar req.user.id em vez de req.user.userId
      const coachId = req.user.id 
      const dashboard = await dashboardService.getCoachDashboard(coachId)

      res.json({
        success: true,
        data: dashboard,
      })
    } catch (error) {
      next(error)
    }
  }

  async getStudentStats(req, res, next) {
    try {
      // CORRIGIDO: Usar req.user.id em vez de req.user.userId
      const coachId = req.user.id
      const { period = "30" } = req.query

      const stats = await dashboardService.getStudentStats(coachId, Number.parseInt(period))

      res.json({
        success: true,
        data: stats,
      })
    } catch (error) {
      next(error)
    }
  }

  async getRecentStudents(req, res, next) {
    try {
      // CORRIGIDO: Usar req.user.id em vez de req.user.userId
      const coachId = req.user.id
      const { limit = 5 } = req.query

      const recentStudents = await dashboardService.getRecentStudents(coachId, Number.parseInt(limit))

      res.json({
        success: true,
        data: recentStudents,
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new DashboardController()