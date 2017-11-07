const { injectBabelPlugin } = require('react-app-rewired');

module.exports = override = config => {
  config = injectBabelPlugin('transform-decorators-legacy', config);
  //config = injectBabelPlugin('transform-export-extensions', config); // no flow support yet

  // getting eslint to work is a bit tricky but can be achieved
  // config.module.rules[0].use[0].options.useEslintrc = true;
  return config;
};


/*module.exports = function override(config, env) {
  //do stuff with the webpack config...
  console.log(typeof config);
  config.push({
    loaders:[
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          plugins: ['transform-decorators-legacy'],
          presets: ['es2015', 'stage-0', 'react']
        }
      }
    ]
  });
  config ={...config,loaders:[
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        plugins: ['transform-decorators-legacy'],
        presets: ['es2015', 'stage-0', 'react']
      }
    }
  ]};

  return config;
}*/
/*
module.exports = (config, env) => {
  const path = require('path');
  //console.log(config);
  config.module.rules.push(
    {
      test: /\.module\.css$/,
      use: [
        'style-loader',
        {
          loader: require.resolve('css-loader'),
          options: {
            modules: true,
            importLoaders: 1,
            localIdentName: '[local]___[hash:base64:5]'
          }
        }
      ],
      include: path.resolve('src'),
      loader: 'babel',
      query: {
        plugins: ['transform-decorators-legacy'],
        presets: ['es2015', 'stage-0', 'react']
      }
    }
  )
  return config
}*/