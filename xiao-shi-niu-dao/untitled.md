# configuration.nix

{% hint style="info" %}
施工中！！！
{% endhint %}

可以用systemd-boot或者grub引导，如果是systemd-boot双系统，需要自己添加windows引导

UEFI 模式下安装 GRUB 2： boot.loader.grub.enable = true; boot.loader.grub.device = "nodev"; boot.loader.grub.efiSupport = true; boot.loader.efi.canTouchEfiVariables = true;

如果不懂，networking.wireless.enable不要设置为true，好像和networkmanager有冲突，可能把kde的wifi管理搞没了

时区 time.timeZone = “Asia/Shanghai”

users.users.alice 改成自己的用户名

桌面环境：

GNOME 桌面：

services.xserver.displayManager.gdm.enable = true; services.xserver.desktopManager.gnome3.enable = true;

Plasma 桌面同理： 

services.xserver.displayManager.sddm.enable = true; services.xserver.desktopManager.plasma5.enable = true;

输入法： i18n.inputMethod = { enabled = "fcitx"; };

