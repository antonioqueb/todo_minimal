from odoo import models, fields

class TodoTask(models.Model):
    _name = 'todo.task'
    _description = 'Tarea de Prueba'

    name = fields.Char(string='Descripción', required=True)
    is_done = fields.Boolean(string='¿Hecho?', default=False)
    priority = fields.Selection([
        ('0', 'Baja'),
        ('1', 'Media'),
        ('2', 'Alta')
    ], string='Prioridad', default='1')
