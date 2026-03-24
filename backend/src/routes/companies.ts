import { Router } from 'express';
import { prisma } from '../index';
import { ApiResponse } from '../utils/ApiResponse';

const router = Router();

// List all companies
router.get('/', async (req, res, next) => {
  try {
    const companies = await prisma.company.findMany({
      include: { _count: { select: { accounts: true } } }
    });
    res.json(ApiResponse.success(companies));
  } catch (error) {
    next(error);
  }
});

// Create a new company
router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body;
    const company = await prisma.company.create({
      data: { name }
    });
    res.json(ApiResponse.success(company));
  } catch (error) {
    next(error);
  }
});

// Get detailed company info
router.get('/:id', async (req, res, next) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.params.id },
      include: { accounts: true }
    });
    if (!company) return res.status(404).json(ApiResponse.error('NOT_FOUND', 'Empresa no encontrada'));
    res.json(ApiResponse.success(company));
  } catch (error) {
    next(error);
  }
});

export default router;
