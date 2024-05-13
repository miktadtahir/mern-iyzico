const iyzipay = require('../config/iyzipayConfig'); // don't forget to create iyzipayConfig.js file
const Iyzipay = require('iyzipay'); // don't forget to install iyzipay package

exports.initializePayment = (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (!req.body.conversationId || !req.body.total || !req.body.basketId || !req.body.buyer || !req.body.shippingAddress || !req.body.billingAddress || !req.body.basketItems) {
        return res.status(400).send({ message: 'Missing required fields in the request body.' });
    }

    const request = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: req.body.conversationId,
        price: req.body.total,
        paidPrice: req.body.total,
        currency: Iyzipay.CURRENCY.TRY,
        basketId: req.body.basketId,
        callbackUrl: 'https://yourcallbakurl.com', // token return url
        enabledInstallments: [ 2, 3, 6, 9, 12],
        buyer: {
            ...req.body.buyer,
            ip: clientIp
        },
        shippingAddress: req.body.shippingAddress,
        billingAddress: req.body.billingAddress,
        basketItems: req.body.basketItems
    };

    console.log('Iyzico request:', request); // log the request, delete after production

    iyzipay.checkoutFormInitialize.create(request, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        console.log('Iyzico response:', result); // log the request, delete after production
        res.send(result);
    });
};