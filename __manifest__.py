{
    'name': 'Tareas Minimalistas Odoo 19',
    'version': '1.1',
    'category': 'Tools',
    'summary': 'Demo de JS moderno con Chart.js y Confetti',
    'depends': ['base', 'web'],
    'data': [
        'security/ir.model.access.csv',
        'views/todo_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'todo_app/static/src/js/todo_dashboard.js',
            'todo_app/static/src/xml/todo_dashboard.xml',
        ],
    },
    'installable': True,
    'application': True,
    'license': 'LGPL-3',
}