const mercadopago = require("mercadopago");

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
  purchase: (req, res) => {
    // Creo un objeto de preferencia
    let preference = {
      items: [
        {
          title: "Mi producto",
          unit_price: 100,
          quantity: 1,
        },
        {
            title: "Mi otro producto",
            unit_price: 140,
            quantity: 3,
          },
      ],
    };

    mercadopago.preferences
      .create(preference)
      .then(function (response) {
        // Este valor reemplazará el string "<%= global.id %>" en tu HTML
        global.id = response.body.id;
        global.init_point = response.body.init_point;
        res.render('confirm');
      })
      .catch(function (error) {
        console.log(error);
      });
  },
};
