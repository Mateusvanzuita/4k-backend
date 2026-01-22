// src/controllers/protocoloController.js

const protocoloService = require("../services/protocoloService")
const { validationResult } = require("express-validator")

class ProtocoloController {
  
  // POST /api/protocolos
  async createProtocolo(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: "Dados inválidos", errors: errors.array() })
      }

      const coachId = req.user.id
      const data = { ...req.body, coachId }

      const protocolo = await protocoloService.createProtocolo(data)

      res.status(201).json({ success: true, message: "Protocolo criado com sucesso", data: protocolo })
    } catch (error) {
      next(error)
    }
  }

  // GET /api/protocolos
  async getProtocolos(req, res, next) {
    try {
      const coachId = req.user.id
      const filters = req.query

      const protocolos = await protocoloService.getProtocolos(coachId, filters)

      res.json({ success: true, data: protocolos })
    } catch (error) {
      next(error)
    }
  }

  // GET /api/protocolos/:id
  async getProtocoloById(req, res, next) {
    try {
      const { id } = req.params
      const coachId = req.user.id

      const protocolo = await protocoloService.getProtocoloById(id, coachId)

      if (!protocolo) {
        return res.status(404).json({ success: false, message: "Protocolo não encontrado" })
      }

      res.json({ success: true, data: protocolo })
    } catch (error) {
      next(error)
    }
  }

  // PUT /api/protocolos/:id
  async updateProtocolo(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: "Dados inválidos", errors: errors.array() })
      }

      const { id } = req.params
      const coachId = req.user.id
      const updateData = req.body

      const protocolo = await protocoloService.updateProtocolo(id, coachId, updateData)

      if (!protocolo) {
        return res.status(404).json({ success: false, message: "Protocolo não encontrado ou não pertence ao coach" })
      }

      res.json({ success: true, message: "Protocolo atualizado com sucesso", data: protocolo })
    } catch (error) {
      next(error)
    }
  }
  
  // POST /api/protocolos/:id/clone
  async cloneProtocolo(req, res, next) {
    try {
        const { id } = req.params
        const coachId = req.user.id

        const clonedProtocolo = await protocoloService.cloneProtocolo(id, coachId)

        if (!clonedProtocolo) {
            return res.status(404).json({ success: false, message: "Protocolo original não encontrado" })
        }

        res.status(201).json({ success: true, message: "Protocolo clonado com sucesso", data: clonedProtocolo })
    } catch (error) {
        next(error)
    }
  }


  // DELETE /api/protocolos/:id
  async deleteProtocolo(req, res, next) {
    try {
      const { id } = req.params
      const coachId = req.user.id

      const deleted = await protocoloService.deleteProtocolo(id, coachId)

      if (!deleted) {
        return res.status(404).json({ success: false, message: "Protocolo não encontrado ou não pertence ao coach" })
      }

      res.json({ success: true, message: "Protocolo excluído com sucesso" })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new ProtocoloController()