const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Nix 中文指南',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: 'https://github.com/wineee/NixOS-CN-Tutorial',
    repoLabel: "查看源码",
    docsBranch: "vuepress",
    docsDir: "src",

    editLinks: true,
    editLinkText: "📝 编辑本文",

    lastUpdated: "📑 最后更新",

    smoothScroll: true,

    nav: [
      {
        text: '用户手册',
        link: '/user_guide/',
      }, {
        text: '开发者手册',
        link: '/developer_guide/',
      }
      /*,{
        text: 'Config',
        link: '/config/'
      },
      {
        text: '官网',
        link: 'https://nixos.org'
      }*/
    ],
    sidebar: {
      '/user_guide/': [
        {
          title: 'Guide',
          collapsable: true,
          children: [
            '',
            'NixOS 安装',
            '基础配置',
            '软件安装',
            '常见问题',
            '参考资料',
            '使用 Flake 配置',
            'home-manager'
          ]
        }
      ],
            
      '/developer_guide/' : [
        {
          title: 'developer guide',
          collapsable: true,
          children: [
            '',
            'rust-dev'
          ]
        }
      ],
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
