const mercadopago = require("mercadopago");
const host = process.env.HOST;
mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN,
  integrator_id: process.env.INTEGRATOR_ID,
});

module.exports = {
  home: (req, res) => {
    return res.render("index");
  },
  detail: (req, res) => {
    return res.render("detail", { ...req.query });
  },
  paymentStatus: (req, res) => {
    if (req.query.status.includes("success")) {
      return res.render("success", {
        payment_type: req.query.payment_type,
        external_reference: req.query.external_reference,
        collection_id: req.query.collection_id
      });
    }

    if (req.query.status.includes("pending")) {
      return res.render("pending");
    }

    if (req.query.status.includes("failure")) {
      return res.render("failure");
    }

    return res.status(404).end();
  },
  webhooks: (req, res) => {
    console.log("WEBHOOK: ", req.body);

    res.status(200).end("OK");
  },
  purchase: (req, res) => {
    // Creo un objeto de preferencia
    let preference = {
      payer: {
        name: "Lalo",
        surname: "Landa",
        email: "test_user_63274575@testuser.com",
        phone: {
          area_code: "11",
          number: 22223333,
        },
        address: {
          zip_code: "1111",
          street_name: "False",
          street_number: 123,
        },
      },
      payment_methods: {
        excluded_payment_methods: [
          { 
            id: "amex" 
          }
        ],
        excluded_payment_types: [
          { 
            id: "atm" 
          }
        ],
        installments: 6,
      },
      notification_url: host + "webhooks",
      auto_return: "approved",
      items: [
        {
          id: "1234",
          title: req.query.title,
          description: "​Dispositivo móvil de Tienda e-commerce​",
          picture_url:
            "https://facuerbin-mercado-pago.herokuapp.com/images/products/" + req.query.img,
          unit_price: Number(req.query.price),
          quantity: 1,
        },
      ],
      back_urls: {
        success: host + "payment?status=success",
        pending: host + "payment?status=pending",
        failure: host + "payment?status=failure",
      },
      external_reference: 'facuerbin@gmail.com'
    };

    mercadopago.preferences
      .create(preference)
      .then(function (response) {
        // Este valor reemplazará el string "<%= global.id %>" en tu HTML
        global.id = response.body.id;
        global.init_point = response.body.init_point;
        res.render("confirm");
      })
      .catch(function (error) {
        console.log(error);
      });
  },
};
