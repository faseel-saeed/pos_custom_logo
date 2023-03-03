# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import fields, models


class PosConfig(models.Model):
    _inherit = 'pos.config'

    hide_company_header = fields.Boolean(string='Hide Company header',
                                         help="Removes the company header from the receipt")
    is_custom_logo = fields.Boolean(string='Custom logo', help="Use a custom logo for this pos")
    special_logo = fields.Binary(string='logo', help="set a logo", attachment=False)
