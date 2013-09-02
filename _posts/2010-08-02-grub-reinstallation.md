---
layout: post
title: "Grub Reinstallation"
description: "Notes on reinstalling grub on grub failure or after windows installation"
category:
tags: []
---
{% include JB/setup %}

It is common that after a windows installation you won't be able to boot to your linux machine. This is because windows boot loader just ignores your linux box. But linux has a very advanced boot loader Grub which can detect both your windows and linux operating systems.

So if you want to reinstall your grub and reaccess linux follow these steps.

There are two versions of Grub, Grub1 and Grub2. You can install any of these to restore the system depending on which version your linux system use.

First boot using a live linux CD or USB and open up a terminal.

# Grub1
	$ sudo grub
now you will get the grub prompt.

	grub> find /boot/grub/stage1
this will give some output like (hdx,n) eg: (hd0,2) now set the root device.

	grub> root (hd0, 2)
setup your grub on the disk hd0.

	grub> setup hd0
thats it now exit the grub prompt

	grub> exit
now reboot.

# Grub2
##method1

First find out the device in which you have your root file system. Use the command "os-prober" or "blkid" to find out your device name. Assume it is sda2 and let it be an ext4 filesystem here sda is the disk name.

	$ sudo blkid
the output will list all the devices with the filesystem info, mount the root filesystem under /mnt

	$ sudo mount -t ext4 /dev/sda2 /mnt
If you have your boot directory as a different device say sda3 mount it at /mnt/boot

	$ sudo mount -t ext4 /dev/sda3 /mnt/boot
now reinstall grub using the following command.

	$ sudo grub-install --root-directory=/mnt /dev/sda
you can test the installation using.

	$ sudo grub-install --recheck /dev/sda

##method2

First method may not work in some cases. So here is a more generic way. Find out your root filesystem device as in method1.

mount the root filesystem(assuming sda2) under mnt

	$ sudo mount -t ext4 /dev/sda2 /mnt
mount the boot device(assuming sda3) under /mnt/boot

	$ sudo mount -t ext4 /dev/sda3
now bind the system directories like dev, sys, proc and usr under /mnt

	$ sudo mount --bind /dev /mnt/dev
	$ sudo mount --bind /proc /mnt/proc
	$ sudo mount --bind /sys /mnt/sys
not switch the root file system to /mnt

	$ sudo chroot /mnt
update your grub

	$ sudo update-grub
Thats it now switch back to the root filesystem and unmount all the devices and reboot, in most cases this method will work.

	$ exit
	$ sudo umount /mnt/{dev|proc|sys|boot}
	$ sudo umount /mnt
	$ sudo reboot