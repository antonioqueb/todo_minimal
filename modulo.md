## ./__init__.py
```py
from . import models
```

## ./__manifest__.py
```py
{
    'name': 'Tareas Minimalistas Odoo 19',
    'version': '1.0',
    'category': 'Tools',
    'depends': ['base'],
    'data': [
        'security/ir.model.access.csv',
        'views/todo_views.xml',
    ],
    'installable': True,
    'application': True,
}
```

## ./models/__init__.py
```py
from . import todo_task
```

## ./models/todo_task.py
```py
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
```

## ./views/todo_views.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <!-- Tree View -->
    <record id="view_todo_task_tree" model="ir.ui.view">
        <field name="name">todo.task.tree</field>
        <field name="model">todo.task</field>
        <field name="arch" type="xml">
            <list editable="bottom">
                <field name="name"/>
                <field name="priority"/>
                <field name="is_done"/>
            </list>
        </field>
    </record>

    <!-- SEARCH VIEW (Lo que quieres probar) -->
    <record id="view_todo_task_search" model="ir.ui.view">
        <field name="name">todo.task.search</field>
        <field name="model">todo.task</field>
        <field name="arch" type="xml">
            <search>
                <!-- Filtro de texto simple -->
                <field name="name" string="Buscar Tarea"/>
                
                <!-- Filtros rápidos (Botones) -->
                <filter string="Pendientes" name="pending" domain="[('is_done', '=', False)]"/>
                <filter string="Alta Prioridad" name="high_priority" domain="[('priority', '=', '2')]"/>
                
                <separator/>
                
                <!-- Agrupadores -->
                <group expand="0" string="Agrupar por">
                    <filter string="Estado" name="group_by_done" context="{'group_by': 'is_done'}"/>
                    <filter string="Prioridad" name="group_by_priority" context="{'group_by': 'priority'}"/>
                </group>
            </search>
        </field>
    </record>

    <!-- Action -->
    <record id="action_todo_task" model="ir.actions.act_window">
        <field name="name">Mis Tareas</field>
        <field name="res_model">todo.task</field>
        <field name="view_mode">list,form</field>
        <field name="search_view_id" ref="view_todo_task_search"/>
        <field name="help" type="html">
            <p class="o_view_nocontent_smiling_face">Crea tu primera tarea para probar el filtro</p>
        </field>
    </record>

    <!-- Menu -->
    <menuitem id="menu_todo_root" name="Todo App" sequence="10"/>
    <menuitem id="menu_todo_task" name="Tareas" parent="menu_todo_root" action="action_todo_task" sequence="10"/>
</odoo>
```

