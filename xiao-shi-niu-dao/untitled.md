# configuration.nix

{% hint style="info" %}
施工中！！！
{% endhint %}

### 启动引导

可以用 systemd-boot 或者 grub 引导，如果是 systemd-boot 双系统，可能需要自己添加 windows 的引导

下面是使用 systemd-boot 的例子：

```text
 # Use the systemd-boot EFI boot loader.
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;
```

下面是使用 grub 的例子：

```text
 # Use GRand Unified Bootloader
  boot.loader = {
    efi.canTouchEfiVariables = true;
    grub = {
      enable = true;
      version = 2;
      device = "nodev";
      useOSProber = true;
      efiSupport = true;
    };
  };
```

### 声音

```text
 # Enable sound.
  sound.enable = true;
  hardware.pulseaudio.enable = true;
```

### 触摸板

```text
# Enable touchpad support (enabled default in most desktopManager).
  services.xserver.libinput.enable = true;
```

### 软件源配置

使用清华源，软件下载速度更快

```text
  nix.binaryCaches = [ 
        "https://mirrors.tuna.tsinghua.edu.cn/nix-channels/store"
  ];
```

### 时区

设置为上海

```text
time.timeZone = “Asia/Shanghai”
```

### 桌面环境

使用 KDE 桌面

```text
 # Enable the Plasma 5 Desktop Environment.
  services.xserver.enable = true;
  services.xserver.displayManager.sddm.enable = true;
  services.xserver.desktopManager.plasma5.enable = true;
```

你也可以使用 GNOME 桌面：

```text
services.xserver.enable = true;
services.xserver.displayManager.gdm.enable = true; 
services.xserver.desktopManager.gnome3.enable = true;
```

### 本地化

支持中文，输入法使用 fcxit

```text
i18n = {
    defaultLocale = "zh_CN.UTF-8";
    supportedLocales = [ "zh_CN.UTF-8/UTF-8" "en_US.UTF-8/UTF-8" ];
    inputMethod.enabled = "fcitx";
  };
```

### 配置字体

```text
fonts = {
        enableDefaultFonts = true;
        fontconfig.enable = true;
        enableFontDir = true;
        #fontDir.enable = true;
        enableGhostscriptFonts = true;
        fonts = with pkgs; [
            sarasa-gothic
            noto-fonts
            noto-fonts-cjk
            noto-fonts-emoji
            wqy_microhei
            wqy_zenhei

        ];
  };
```

