import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { ApiResponse } from '../utils/ApiResponse';

const router = Router();

// GET all users
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        permissions: true,
        skin: true,
        createdAt: true
      }
    });

    const formattedUsers = users.map(u => ({
      ...u,
      permissions: JSON.parse(u.permissions || '[]')
    }));

    res.json(ApiResponse.success(formattedUsers));
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json(ApiResponse.error('SERVER_ERROR', 'Error al obtener usuarios'));
  }
});

// POST create user
router.post('/', async (req: Request, res: Response) => {
  const { email, password, name, role, permissions } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'USER',
        permissions: JSON.stringify(permissions || []),
        skin: 'default'
      }
    });

    res.status(201).json(ApiResponse.success({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }));
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json(ApiResponse.error('VALIDATION_ERROR', 'El email ya está en uso'));
    }
    console.error('Error creating user:', error);
    res.status(500).json(ApiResponse.error('SERVER_ERROR', 'Error al crear usuario'));
  }
});

// PUT update user
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, name, role, permissions, password } = req.body;

  try {
    const updateData: any = {
      email,
      name,
      role,
      permissions: JSON.stringify(permissions)
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: id as string },
      data: updateData
    });

    res.json(ApiResponse.success({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }));
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json(ApiResponse.error('SERVER_ERROR', 'Error al actualizar usuario'));
  }
});

// DELETE user
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id: id as string }
    });
    res.json(ApiResponse.success({ message: 'Usuario eliminado con éxito' }));
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json(ApiResponse.error('SERVER_ERROR', 'Error al eliminar usuario'));
  }
});

export default router;
