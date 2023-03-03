# -*- coding: utf-8 -*-
# See LICENSE file for full copyright and licensing details.

{
    'name': 'pos_custom_logo',
    'version': '0.1.0',
    'author': 'Benlever Pvt Ltd',
    'company': 'Benelever Pvt Ltd',
    'website': 'https://www.benlever.com',
    'maintainer': 'Benlever Pvt Ltd',
    'category': 'Sales/Point of Sale',
    'sequence': 6,
    'summary': 'Allows you to set a custom logo for each POS that is different from the company logo',
    'description': """

Use a custom logo for the Point of Sale Receipt
""",
    'depends': ['point_of_sale'],
    'data': [
        'views/res_config_settings_views.xml',
    ],
    'assets': {
        'point_of_sale.assets': [
            'pos_custom_logo/static/src/xml/**/*',
            'pos_custom_logo/static/src/js/**/*',
        ],
    },
    'installable': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
