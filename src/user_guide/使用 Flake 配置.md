# flake

```bash
cd /etc/nixos
nix flake init
vi flake.nix
```

一个基础的配置：

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

## 参考资料
https://www.tweag.io/blog/2020-07-31-nixos-flakes/
https://nixos.wiki/wiki/Flakes

## 使用  nixos-cn flake
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
