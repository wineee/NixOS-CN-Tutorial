# 使用 flake 配置

第一步，使用 `nix flake init` 生成 flake.nix 文件

```bash
cd /etc/nixos
nix flake init
vi flake.nix
```

修改 flake.nix 文件，一个基础的配置是：

```nix
{
  description = "nixos-config";     

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";                

  outputs = { self, nixpkgs, ...}@inputs: {
    nixosConfigurations.nixos =  nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";
        modules = [ ./configuration.nix ];
        specialArgs = { inherit inputs; };
      };
    };
}

```

这个配置通过 modules 引入 configuration.nix，可以由传统配置轻松转化过来，你仍然可以像以前那样配置系统。

实际上，使用 flake 后， configuration.nix 仅仅是一个普通的，被调用的函数了，你可以把它改成其他名字，此外，配置文件也不必放在 `/etc/nixos` 了，你可以放在任何自己喜欢的地方。

::: warning
如果你以前使用 git 管理配置文件，使用 flake 时需要注意 git 必须 add 所有必须的文件，包括 hardware-configuration.nix， 否则 flake 会找不到这个文件。

如果你有修改没有 commit, 会提示 `warning: Git tree '/etc/nixos' is dirty`， 不用担心，没有 commit 的修改也是生效的（但是新增了文件一定要记得 git add）。
:::


运行 `nix update`， 会更新 flake.lock 文件，和一些现代语言的包管理器（如 npm, cargo） 一样， flake.lock 可以确定input（本例中只有nixpkgs）的特定版本，如果升级后出现问题，可以很方便的回滚。同时，更能保证配置的一致性。

运行 `nix flake check` 可以检查是否有语法错误。

运行 `nix flake show`，结果是：
```txt
git+file:///etc/nixos
└───nixosConfigurations
    └───nixos: NixOS configuration
```

更新配置后仍然可以使用 `nixos-rebuild switch` 来重建系统
`nixos-rebuild switch -v -L` 可以显示详细的构建信息

::: tip
在第一次安装 NixOS 时，由于 flake 是实验特性，如果你要安装 flake 化的系统配置，需要一下步骤：

1. 在 live 系统中，安装 unstable 版的 nix
nix-env -iA nixos.nixUnstable

2. 通过 `nix --experimental-features 'nix-command flakes' flake update` 可以临时允许使用 flakes 特性
```bash
[root@nixos:/mnt/etc/nixos] nix --experimental-features 'nix-command flakes' flake show 
warning: Git tree '/mnt/etc/nixos' is dirty
git+file:///mnt/etc/nixos
└───nixosConfigurations
    └───nixos: NixOS configuration
```
安装使用以下命令：

nixos-install --flake git+file:///mnt/etc/nixos#nixos --show-trace
:::

## 参考资料
https://www.tweag.io/blog/2020-07-31-nixos-flakes/
https://nixos.wiki/wiki/Flakes

下面增加 nixos-cn 的 flake，并安装其提供的网易云音乐

## 使用 nixos-cn flake
```nix
{
  description = "nixos-config";     

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";                

  inputs.nixos-cn = {
    url = "github:nixos-cn/flakes";
    # 强制 nixos-cn 和该 flake 使用相同版本的 nixpkgs
    inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, nixpkgs, nixos-cn, ...}@inputs: {
    nixosConfigurations.nixos =  nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";
        modules = [ 
          ./configuration.nix
           ({ ... }: {
            # 使用 nixos-cn flake 提供的包
            environment.systemPackages =
              [ nixos-cn.legacyPackages.x86_64-linux.netease-cloud-music ];
            # 使用 nixos-cn 的 binary cache
            nix.binaryCaches = [
              "https://nixos-cn.cachix.org"
            ];
            nix.binaryCachePublicKeys = [ "nixos-cn.cachix.org-1:L0jEaL6w7kwQOPlLoCR3ADx+E3Q8SEFEcB9Jaibl0Xg=" ];

            imports = [
              # 将nixos-cn flake提供的registry添加到全局registry列表中
              # 可在`nixos-rebuild switch`之后通过`nix registry list`查看
              nixos-cn.nixosModules.nixos-cn-registries

              # 引入nixos-cn flake提供的NixOS模块
              nixos-cn.nixosModules.nixos-cn
            ];
          })
        ];
        specialArgs = { inherit inputs; };
      };
    };
}

```
