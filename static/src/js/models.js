odoo.define('pos_custom_logo.models', function(require) {
    "use strict";

    const {PosGlobalState, Order, Orderline, Payment} = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');
    const core = require('web.core');
    const {batched} = require('point_of_sale.utils')
    const QWeb = core.qweb;
    var _t = core._t;


    const PosCustomLogoOrder = (Order) => class PosCustomLogoOrder extends Order {
        constructor(obj, options) {
            super(...arguments);
        }
        //@override
        export_for_printing() {
            var orderlines = [];
            var self = this;

            this.orderlines.forEach(function(orderline) {
                orderlines.push(orderline.export_for_printing());
            });

            // If order is locked (paid), the 'change' is saved as negative payment,
            // and is flagged with is_change = true. A receipt that is printed first
            // time doesn't show this negative payment so we filter it out.
            var paymentlines = this.paymentlines
                .filter(function(paymentline) {
                    return !paymentline.is_change;
                })
                .map(function(paymentline) {
                    return paymentline.export_for_printing();
                });
            let partner = this.partner;
            let cashier = this.pos.get_cashier();
            let company = this.pos.company;
            let date = new Date();

            function is_html(subreceipt) {
                return subreceipt ? (subreceipt.split('\n')[0].indexOf('<!DOCTYPE QWEB') >= 0) : false;
            }

            function render_html(subreceipt) {
                if (!is_html(subreceipt)) {
                    return subreceipt;
                } else {
                    subreceipt = subreceipt.split('\n').slice(1).join('\n');
                    var qweb = new QWeb2.Engine();
                    qweb.debug = config.isDebug();
                    qweb.default_dict = _.clone(QWeb.default_dict);
                    qweb.add_template('<templates><t t-name="subreceipt">' + subreceipt + '</t></templates>');

                    return qweb.render('subreceipt', {
                        'pos': self.pos,
                        'order': self,
                        'receipt': receipt
                    });
                }
            }

            var receipt = {
                orderlines: orderlines,
                paymentlines: paymentlines,
                subtotal: this.get_subtotal(),
                total_with_tax: this.get_total_with_tax(),
                total_rounded: this.get_total_with_tax() + this.get_rounding_applied(),
                total_without_tax: this.get_total_without_tax(),
                total_tax: this.get_total_tax(),
                total_paid: this.get_total_paid(),
                total_discount: this.get_total_discount(),
                rounding_applied: this.get_rounding_applied(),
                tax_details: this.get_tax_details(),
                change: this.locked ? this.amount_return : this.get_change(),
                name: this.get_name(),
                partner: partner ? partner : null,
                invoice_id: null,
                cashier: cashier ? cashier.name : null,
                precision: {
                    price: 2,
                    money: 2,
                    quantity: 3,
                },
                date: {
                    year: date.getFullYear(),
                    month: date.getMonth(),
                    date: date.getDate(), // day of the month
                    day: date.getDay(), // day of the week
                    hour: date.getHours(),
                    minute: date.getMinutes(),
                    isostring: date.toISOString(),
                    localestring: this.formatted_validation_date,
                    validation_date: this.validation_date,
                },
                company: {
                    email: company.email,
                    website: company.website,
                    company_registry: company.company_registry,
                    contact_address: company.partner_id[1],
                    vat: company.vat,
                    vat_label: company.country && company.country.vat_label || _t('Tax ID'),
                    name: company.name,
                    phone: company.phone,
                    logo: this.pos.company_logo_base64,
                },
                currency: this.pos.currency,
                pos_qr_code: this._get_qr_code_data(),
            };
            if (this.pos.config.is_custom_logo == true) {
                receipt.company.logo = 'data:image/jpg;base64,' + this.pos.config.special_logo;
            }

            if (is_html(this.pos.config.receipt_header)) {
                receipt.header = '';
                receipt.header_html = render_html(this.pos.config.receipt_header);
            } else {
                receipt.header = this.pos.config.receipt_header || '';
            }

            if (is_html(this.pos.config.receipt_footer)) {
                receipt.footer = '';
                receipt.footer_html = render_html(this.pos.config.receipt_footer);
            } else {
                receipt.footer = this.pos.config.receipt_footer || '';
            }
            if (!receipt.date.localestring && (!this.state || this.state == 'draft')) {
                receipt.date.localestring = field_utils.format.datetime(moment(new Date()), {}, {
                    timezone: false
                });
            }

            return receipt;

        }

    }
    Registries.Model.extend(Order, PosCustomLogoOrder);

});