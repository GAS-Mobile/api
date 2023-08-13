const { Analyst } = require('../models/Analyst')

const createAnalyst = async (req, res) => {
  try {
    const data = req.body.analyst

    const analystExists = await Analyst.exists({cpf: data.cpf})

    if (analystExists) {
      return res.status(409).json({ message: 'Analyst already exists' })
    }

    await Analyst.create(data)
    res.status(201).json({ message: 'Analyst created successfully' })

  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the analyst' })
  }
}

const getAnalysts = async (req, res) => {
  try {
    const analysts = await Analyst.find()
      .select({_id: 1, __v:0})
      
    res.status(200).json({analysts})

  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching analysts' })
  }
}

const getAnalystByID = async (req, res) => {
  try {
    const analystID = req.params.id

    if (analystID.length !== 24) {
      return res.status(404).json({ message: 'Analyst not found' })
    }

    const analyst = await Analyst.findById(analystID)
      .select({__v: 0, _id: 0})

    if (!analyst) {
      return res.status(404).json({ message: 'Analyst not found' })
    }

    res.status(200).json({ analyst })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateAnalystByID = async (req, res) => {
  try {
    const analystID = req.params.id
    const data = req.body.analyst

    if (analystID.length !== 24) {
      return res.status(404).json({ message: 'Analyst not found' })
    }

    const analyst = await Analyst.findById(analystID)

    if (!analyst) {
      return res.status(404).json({ message: 'Analyst not found' })
    }

    analyst.name = data.name
    await analyst.save()
    res.status(200).json({ message: 'Analyst updated successfully' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteAnalystByID = async (req, res) => {
  try {
    const analystID = req.params.id

    if (analystID.length !== 24) {
      return res.status(404).json({ message: 'Analyst not found' })
    }

    const analystExists = await Analyst.exists({ _id: analystID })

    if (!analystExists) {
      return res.status(404).json({ message: 'Analyst not found' })
    }

    await Analyst.deleteOne({ _id: analystID})
    res.status(200).json({ message: 'Analyst deleted successfully' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createAnalyst,
  getAnalysts,
  getAnalystByID,
  updateAnalystByID,
  deleteAnalystByID
}
