const alimentoRepository = require("../repositories/alimentoRepository")

class AlimentoService {
  async create(alimentoData) {
    // Validar dados nutricionais
    this.validateNutritionalData(alimentoData)

    return await alimentoRepository.create(alimentoData)
  }

  async getAll(filters, page, limit, orderBy, order) {
    return await alimentoRepository.getAll(filters, page, limit, orderBy, order)
  }

  async getById(id, coachId) {
    return await alimentoRepository.getById(id, coachId)
  }

  async update(id, updateData, coachId) {
    // Verificar se o alimento existe e pertence ao coach
    const existingAlimento = await alimentoRepository.getById(id, coachId)
    if (!existingAlimento) {
      throw new Error("Alimento não encontrado ou não pertence a este coach")
    }

    // Validar dados nutricionais se fornecidos
    if (updateData.calorias || updateData.proteinas || updateData.carboidratos || updateData.gorduras) {
      this.validateNutritionalData(updateData)
    }

    return await alimentoRepository.update(id, updateData)
  }

  async delete(id, coachId) {
    // Verificar se o alimento existe e pertence ao coach
    const existingAlimento = await alimentoRepository.getById(id, coachId)
    if (!existingAlimento) {
      throw new Error("Alimento não encontrado ou não pertence a este coach")
    }

    return await alimentoRepository.delete(id)
  }

  async getByCategory(categoria, coachId) {
    return await alimentoRepository.getByCategory(categoria, coachId)
  }

  validateNutritionalData(data) {
    const { calorias, proteinas, carboidratos, gorduras, quantidade } = data

    if (calorias < 0 || proteinas < 0 || carboidratos < 0 || gorduras < 0) {
      throw new Error("Valores nutricionais não podem ser negativos")
    }

    if (quantidade <= 0) {
      throw new Error("Quantidade deve ser maior que zero")
    }

    // Validação básica: 1g proteína = 4 kcal, 1g carb = 4 kcal, 1g gordura = 9 kcal
    if (calorias && proteinas && carboidratos && gorduras) {
      const calculatedCalories = proteinas * 4 + carboidratos * 4 + gorduras * 9
      const tolerance = calculatedCalories * 0.2 // 20% de tolerância

      if (Math.abs(calorias - calculatedCalories) > tolerance) {
        console.warn(
          `Possível inconsistência nos valores nutricionais. Calculado: ${calculatedCalories.toFixed(2)} kcal, Informado: ${calorias} kcal`,
        )
      }
    }
  }
}

module.exports = new AlimentoService()
