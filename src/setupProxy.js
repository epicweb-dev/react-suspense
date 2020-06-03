const path = require('path')

function proxy(app) {
  app.get(/^\/img\/.*$/, (req, res, next) => {
    const options = {
      root: path.join(__dirname, '..', 'public'),
      dotfiles: 'deny',
      headers: {
        'cache-control': 'public,max-age=3600,immutable',
        proxy: true,
      },
    }

    const fileName = req.originalUrl
    res.sendFile(fileName, options, err => {
      if (err) next(err)
    })
  })
}

module.exports = proxy
