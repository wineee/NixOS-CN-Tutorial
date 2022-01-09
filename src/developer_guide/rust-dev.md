# rust 

## 基础

使用 cargo：

```bash
nix-shell -p cargo
cargo new
cargo run
```

## 使用 [cargo2nix](https://github.com/cargo2nix/cargo2nix) 

cargo2nix 可以将 cargo.toml 中的依赖转换为 nix 可用的依赖。

```bash
nix shell github:cargo2nix/cargo2nix/master

cargo2nix --version

# 在 Cargo.lock & Cargo.toml 文件所在目录下，执行
cargo2nix -f
# Results in Cargo.nix
```

参考 [Example projects](https://github.com/cargo2nix/cargo2nix/tree/master/examples) 补充：

```bash
nix flake init
vi flake.nix
```
修改 flake.nix 为：

``` nix
{
  # inputs is a set, declaring all of the flakes this flake depends on
  inputs = {
    # we of course want nixpkgs to provide stdenv, dependency packages, and
    # various nix functions
    nixpkgs.url = "github:nixos/nixpkgs?ref=release-21.05";
  
    # we need the overlay at cargo2nix/overlay
    cargo2nix.url = "github:cargo2nix/cargo2nix/master";
    
    # we will need a rust toolchain at least to build our project
    rust-overlay.url = "github:oxalica/rust-overlay";
    rust-overlay.inputs.nixpkgs.follows = "nixpkgs";
    rust-overlay.inputs.flake-utils.follows = "flake-utils";
    
    # convenience functions for writing flakes
    flake-utils.url = "github:numtide/flake-utils";
  };

  # outputs is a function that unsurprisingly consumes the inputs
  outputs = { self, nixpkgs, cargo2nix, flake-utils, rust-overlay, ... }:

    # Build the output set for each default system and map system sets into
    # attributes, resulting in paths such as:
    # nix build .#packages.x86_64-linux.<name>
    flake-utils.lib.eachDefaultSystem (system:
    
      # let-in expressions, very similar to Rust's let bindings.  These names
      # are used to express the output but not themselves paths in the output.
      let

        # create nixpkgs that contains rustBuilder from cargo2nix overlay
        pkgs = import nixpkgs {
          inherit system;
          overlays = [(import "${cargo2nix}/overlay")
                      rust-overlay.overlay];
        };

        # create the workspace & dependencies package set
        rustPkgs = pkgs.rustBuilder.makePackageSet' {
          rustChannel = "1.56.1";
          packageFun = import ./Cargo.nix;
        };
        
      in rec {
        # this is the output (recursive) set (expressed for each system)

        # the packages in `nix build .#packages.<system>.<name>`
        packages = {
          # nix build .#hello-world
          # nix build .#packages.x86_64-linux.hello-world
          hello-world = (rustPkgs.workspace.hello-world {}).bin;
        };

        # nix build
        defaultPackage = packages.hello-world;
      }
    );
}
```


::: warning
如果你使用 git 管理项目, 确保 flake.nix，Cargo.nix 已经被添加 
:::

`nix develop` 进入开发环境（需要 flake.nix 配置 devShell）

`nix build` 构建软件，结果在 result-bin/ 下

::: tip
当构建 `sys` crates 时，build.rs 脚本可能会丢失的原生依赖项。请参阅 overlay/overrides.nix，修复依赖缺失的问题。

比如构建 glib-sys 找不到 glib-2.0，需要在 flake.nix 中添加：
```nix
  rustPkgs = pkgs.rustBuilder.makePackageSet' {
  
    packageOverrides = pkgs: pkgs.rustBuilder.overrides.all ++ [
    
      (pkgs.rustBuilder.rustLib.makeOverride {
          name = "glib-sys";
          overrideAttrs = drv: {
            propagatedNativeBuildInputs = drv.propagatedNativeBuildInputs or [ ] ++ [
              pkgs.glib.dev
            ];
          };
      })
      
    ];
  };
```
:::

## 参考资料

[NixOS Wiki(Rust)](https://nixos.wiki/wiki/Rust)
