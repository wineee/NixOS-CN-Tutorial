# nixos 的安装教程

## 制作启动盘 

准备：一个 2G 以上的 U盘，ISO 镜像，当然还有一台有联网环境的电脑🖥️

在官网下载镜像：[https://nixos.org/download.html](https://nixos.org/download.html) 

> 有 GNOME 和 KDE Plasma 两个版本可选，当然这只是 live 系统中的桌面环境，你可以在安装时自由选择安装任何桌面环境。

u盘启动盘建议直接用 [ventoy](https://www.ventoy.net/cn/index.html) 配置，安装好后，只需把 ISO 镜像放入U盘就可以启动了。即使你以后要换用其他镜像，也不用重新格式化U盘了。

当然，使用 [rufus](https://rufus.ie) 等工具进行刻录也是可以的。 

## 创建分区并格式化

> 在 live 系统中输入 nixos-help 或者点击桌面上的 NixOS Manual 打开帮助文档，按文档的提示操作

{% hint style="info" %}
在 live 系统中你可以无密码的使用 sudo，但不能用 su。
{% endhint %}

分区操作和安装其他的 linux 发行版时没有什么区别，这里按照 NixOS Manual 给出的步骤进行。

分区方案因引导方式（ Legacy Boot 和 UEFI ）不同而有所区别， 比较新的电脑一般推荐使用 UEFI （CPT 分区表）方案。

### UEFI（GPT 分区表）

1. 创建一份 GPT 分区表：

   ```text
   # parted /dev/sda -- mklabel gpt
   ```

2. 添加 root 分区，它占据除了磁盘的末端外的空间（也就是交换分区所在地）。磁盘的前端需要留有 512 Mib 大的空间供给引导分区：

   ```text
   # parted /dev/sda -- mkpart primary 512MiB -8GiB
   ```

3. 添加交换分区。按需分配，示例中创建一个 8 GiB 大的：

   ```text
   # parted /dev/sda -- mkpart primary linux-swap -8GiB 100%
   ```

{% hint style="info" %}
交换分区大小一般为内存的0.5-2倍，桌面端一般比服务器的要小。如果内存足够大，也可以不设。
{% endhint %}

    4. 添加引导分区。NixOS 默认 ESP（EFI 系统分区）作为`/boot`分区。先初始化磁盘前端大小为 512 MiB 的部分：

```text
# parted /dev/sda -- mkpart ESP fat32 1MiB 512MiB
# parted /dev/sda -- set 3 boot on
```

### **Legacy Boot（MBR 分区表）**

> 如果你使用 UEFI（GPT 分区表）方案，跳过这一步。

对于 Legacy Boot，下面给出一个分区样式。`/dev/sda`代指被安装的设备：

1. 创建一份 MBR 分区表。

   ```text
   # parted /dev/sda -- mklabel msdos
   ```

2. 添加 root 分区，它占据除了磁盘的末端外的空间（也就是交换分区所在地）。

   ```text
   # parted /dev/sda -- mkpart primary 1MiB -8GiB
   ```

3. 添加交换分区。按需分配，示例中创建了一个 8 GiB 大的：

   ```text
   # parted /dev/sda -- mkpart primary linux-swap -8GiB 100%
   ```

之后进行格式化操作。

### 格式化 

格式化为 Ext 4 分区。建议给文件系统一个有意义的标签（例子中是 nixos），它让文件系统配置独立于设备设置。像这样：

* ```text
  # mkfs.ext4 -L nixos /dev/sda1
  ```
* 设置交换分区：

  ```text
  # mkswap -L swap /dev/sda2
  ```

* 创建引导分区：（仅 UEFI 方案需要）

  ```text
  # mkfs.fat -F 32 -n boot /dev/sda3
  ```



编写配置文件 挂载将要安装 NixOS 的文件系统： sudo mount /dev/disk/by-label/nixos /mnt 1 挂载引导文件系统： sudo mkdir -p /mnt/boot sudo mount /dev/disk/by-label/boot /mnt/boot 1 2 设置交换分区 sudo swapon /dev/sda2 1 如果安装出错了，再次进入live系统，只要mount一下，改配置就行

## 挂载

{% hint style="info" %}
如果安装完成后发现有重大错误，比如网络组件有问题，可以从这一步重新开始
{% endhint %}

1. 挂载将要安装 NixOS 的分区，例子是 /mnt：

   ```text
   # mount /dev/disk/by-label/nixos /mnt
   ```

2. 挂载 boot 分区，例子是 /mnt/boot（仅 UEFI 方案需要）：

   ```text
   # mkdir -p /mnt/boot
   # mount /dev/disk/by-label/boot /mnt/boot
   ```

3. 激活交换分区：

   ```text
   # swapon /dev/sda2
   ```

## 进行配置

命令`nixos-generate-config`生成一份初始化配置文件：

```text
# nixos-generate-config -- root /mnt
```

编辑它使其满足你的需求：

```text
# nano /mnt/etc/nixos/configuration.nix
```

{% hint style="info" %}
这是最关键的一步，你的 configuration.nix 文件基本决定了你的系统是什么样子
{% endhint %}

请由于内容较多，请跳往下一章观看。

## 完成安装 

通过命令 `nixos-install` 完成安装与配置，如果执行成功，会让你设置root 用户密码。

{% hint style="info" %}
如果安装时无人值守，可以通过`nixos-install --no-root-passwd`来禁用需要密码的场景。
{% endhint %}

重启，进入系统后，新账户是不能进的，先登录 root 账户，用 passwd 给新账户设置密码。

在安装好的系统中更改配置文件后用nixos-rebuild switch应用。如果网络配置有有问题，要回到 live 系统联网下载软件，用的还是 `nixos-install`命令，而不是 `nix-rebuild`…

