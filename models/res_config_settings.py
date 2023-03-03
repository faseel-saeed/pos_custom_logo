# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import fields, models, api


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    pos_hide_company_header = fields.Boolean(compute='_compute_hide_company_logo', store=True, readonly=False)
    pos_is_custom_logo = fields.Boolean(compute='_compute_is_pos_logo', store=True, readonly=False)
    pos_special_logo = fields.Binary(compute='_compute_pos_special_logo', store=True, readonly=False, attachment=False)

    @api.depends('pos_config_id')
    def _compute_hide_company_logo(self):
        for res_config in self:
            res_config.pos_hide_company_header = res_config.pos_config_id.is_custom_logo

    @api.depends('pos_config_id')
    def _compute_is_pos_logo(self):
        for res_config in self:
            res_config.pos_is_custom_logo = res_config.pos_config_id.is_custom_logo

    @api.depends('pos_config_id')
    def _compute_pos_special_logo(self):
        for res_config in self:
            res_config.pos_special_logo = res_config.pos_config_id.special_logo
