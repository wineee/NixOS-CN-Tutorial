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

  inputs.nixos.url = "github:NixOS/nixpkgs/nixos-unstable";                

  outputs = { self, nixos, ...}@inputs: {
    nixosConfigurations.nixos =  nixos.lib.nixosSystem {
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