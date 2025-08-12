import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// =====================================
// TICKET MANAGEMENT
// =====================================

export const createTicket = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      category,
      priority,
      appId,
      customerName,
      customerEmail,
      customerPhone,
      tags
    } = req.body;

    // Validate required fields
    if (!title || !description || !type || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, type, and category are required'
      });
    }

    // Generate ticket number
    const ticketCount = await prisma.supportTickets.count();
    const ticketNumber = `TICK-${String(ticketCount + 1).padStart(6, '0')}`;

    // Create ticket
    const ticket = await prisma.supportTickets.create({
      data: {
        ticketNumber,
        title,
        description,
        type,
        category,
        priority: priority || 'MEDIUM',
        status: 'OPEN',
        appId: appId ? parseInt(appId) : null,
        createdById: req.user.id,
        customerName,
        customerEmail,
        customerPhone,
        tags: tags || []
      },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        },
        app: {
          select: {
            id: true,
            name: true,
            subdomain: true
          }
        }
      }
    });

    // Log activity
    await prisma.appAuditLogs.create({
      data: {
        appId: appId ? parseInt(appId) : null,
        userId: req.user.id,
        action: 'CREATE',
        resource: 'tickets',
        resourceId: ticket.id,
        details: { ticketNumber, title },
        ipAddress: req.ip
      }
    });

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: ticket
    });

  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      status, 
      priority, 
      type, 
      category,
      appId,
      assignedToId 
    } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { ticketNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = category;
    }

    if (appId) {
      where.appId = parseInt(appId);
    }

    if (assignedToId) {
      where.assignedToId = parseInt(assignedToId);
    }

    // Filter by user permissions
    if (req.user.role !== 'SUPER_ADMIN') {
      where.OR = [
        { createdById: req.user.id },
        { assignedToId: req.user.id },
        { appId: { in: await getUserAppIds(req.user.id) } }
      ];
    }

    const [tickets, total] = await Promise.all([
      prisma.supportTickets.findMany({
        where,
        include: {
          createdBy: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true
            }
          },
          assignedTo: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true
            }
          },
          app: {
            select: {
              id: true,
              name: true,
              subdomain: true
            }
          },
          comments: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              user: {
                select: {
                  username: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          _count: {
            select: {
              comments: true,
              attachments: true
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.supportTickets.count({ where })
    ]);

    res.json({
      success: true,
      data: tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await prisma.supportTickets.findUnique({
      where: { id: parseInt(id) },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        },
        app: {
          select: {
            id: true,
            name: true,
            subdomain: true
          }
        },
        comments: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        attachments: {
          orderBy: { uploadedAt: 'desc' }
        },
        history: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                username: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.json({
      success: true,
      data: ticket
    });

  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if ticket exists
    const existingTicket = await prisma.supportTickets.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingTicket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'SUPER_ADMIN' && 
        existingTicket.createdById !== req.user.id && 
        existingTicket.assignedToId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this ticket'
      });
    }

    // Track changes for history
    const changes = {};
    Object.keys(updateData).forEach(key => {
      if (existingTicket[key] !== updateData[key]) {
        changes[key] = {
          old: existingTicket[key],
          new: updateData[key]
        };
      }
    });

    // Update ticket
    const updatedTicket = await prisma.supportTickets.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    // Log changes in history
    if (Object.keys(changes).length > 0) {
      await prisma.ticketHistory.create({
        data: {
          ticketId: parseInt(id),
          userId: req.user.id,
          action: 'UPDATE',
          details: changes,
          ipAddress: req.ip
        }
      });
    }

    res.json({
      success: true,
      message: 'Ticket updated successfully',
      data: updatedTicket
    });

  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedToId } = req.body;

    if (!assignedToId) {
      return res.status(400).json({
        success: false,
        message: 'Assigned user ID is required'
      });
    }

    // Check if ticket exists
    const ticket = await prisma.supportTickets.findUnique({
      where: { id: parseInt(id) }
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if user exists
    const user = await prisma.adminUsers.findUnique({
      where: { id: parseInt(assignedToId) }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Assigned user not found'
      });
    }

    // Update ticket assignment
    const updatedTicket = await prisma.supportTickets.update({
      where: { id: parseInt(id) },
      data: {
        assignedToId: parseInt(assignedToId),
        assignedAt: new Date(),
        status: 'ASSIGNED'
      }
    });

    // Log assignment in history
    await prisma.ticketHistory.create({
      data: {
        ticketId: parseInt(id),
        userId: req.user.id,
        action: 'ASSIGN',
        details: { 
          assignedTo: user.username,
          assignedToId: parseInt(assignedToId)
        },
        ipAddress: req.ip
      }
    });

    res.json({
      success: true,
      message: 'Ticket assigned successfully',
      data: updatedTicket
    });

  } catch (error) {
    console.error('Assign ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const changeTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Check if ticket exists
    const ticket = await prisma.supportTickets.findUnique({
      where: { id: parseInt(id) }
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Update ticket status
    const updateData = { status };
    
    if (status === 'RESOLVED') {
      updateData.resolvedAt = new Date();
    } else if (status === 'CLOSED') {
      updateData.closedAt = new Date();
    }

    const updatedTicket = await prisma.supportTickets.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    // Log status change in history
    await prisma.ticketHistory.create({
      data: {
        ticketId: parseInt(id),
        userId: req.user.id,
        action: 'STATUS_CHANGE',
        oldValue: ticket.status,
        newValue: status,
        ipAddress: req.ip
      }
    });

    res.json({
      success: true,
      message: 'Ticket status updated successfully',
      data: updatedTicket
    });

  } catch (error) {
    console.error('Change ticket status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// =====================================
// TICKET COMMENTS
// =====================================

export const addTicketComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, isInternal } = req.body;

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: 'Comment is required'
      });
    }

    // Check if ticket exists
    const ticket = await prisma.supportTickets.findUnique({
      where: { id: parseInt(id) }
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Create comment
    const newComment = await prisma.ticketComments.create({
      data: {
        ticketId: parseInt(id),
        userId: req.user.id,
        comment,
        isInternal: isInternal || false
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Log comment in history
    await prisma.ticketHistory.create({
      data: {
        ticketId: parseInt(id),
        userId: req.user.id,
        action: 'ADD_COMMENT',
        details: { 
          commentId: newComment.id,
          isInternal: isInternal || false
        },
        ipAddress: req.ip
      }
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: newComment
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateTicketComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: 'Comment is required'
      });
    }

    // Check if comment exists
    const existingComment = await prisma.ticketComments.findUnique({
      where: { id: parseInt(commentId) }
    });

    if (!existingComment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'SUPER_ADMIN' && 
        existingComment.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this comment'
      });
    }

    // Update comment
    const updatedComment = await prisma.ticketComments.update({
      where: { id: parseInt(commentId) },
      data: { comment },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: updatedComment
    });

  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteTicketComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Check if comment exists
    const comment = await prisma.ticketComments.findUnique({
      where: { id: parseInt(commentId) }
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'SUPER_ADMIN' && 
        comment.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this comment'
      });
    }

    // Delete comment
    await prisma.ticketComments.delete({
      where: { id: parseInt(commentId) }
    });

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// =====================================
// TICKET ATTACHMENTS
// =====================================

export const uploadTicketAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileName, originalName, filePath, fileSize, mimeType } = req.body;

    if (!fileName || !originalName || !filePath || !fileSize || !mimeType) {
      return res.status(400).json({
        success: false,
        message: 'All file information is required'
      });
    }

    // Check if ticket exists
    const ticket = await prisma.supportTickets.findUnique({
      where: { id: parseInt(id) }
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Create attachment record
    const attachment = await prisma.ticketAttachments.create({
      data: {
        ticketId: parseInt(id),
        fileName,
        originalName,
        filePath,
        fileSize: parseInt(fileSize),
        mimeType
      }
    });

    // Log attachment in history
    await prisma.ticketHistory.create({
      data: {
        ticketId: parseInt(id),
        userId: req.user.id,
        action: 'ADD_ATTACHMENT',
        details: { 
          attachmentId: attachment.id,
          fileName: originalName
        },
        ipAddress: req.ip
      }
    });

    res.status(201).json({
      success: true,
      message: 'Attachment uploaded successfully',
      data: attachment
    });

  } catch (error) {
    console.error('Upload attachment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteTicketAttachment = async (req, res) => {
  try {
    const { attachmentId } = req.params;

    // Check if attachment exists
    const attachment = await prisma.ticketAttachments.findUnique({
      where: { id: parseInt(attachmentId) }
    });

    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found'
      });
    }

    // Delete attachment
    await prisma.ticketAttachments.delete({
      where: { id: parseInt(attachmentId) }
    });

    res.json({
      success: true,
      message: 'Attachment deleted successfully'
    });

  } catch (error) {
    console.error('Delete attachment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// =====================================
// HELPER FUNCTIONS
// =====================================

async function getUserAppIds(userId) {
  const userApps = await prisma.generatedApps.findMany({
    where: {
      OR: [
        { createdById: userId },
        { managedById: userId }
      ]
    },
    select: { id: true }
  });
  
  return userApps.map(app => app.id);
} 