# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "workshop-secure-messenger"
  config.vm.network "forwarded_port", guest: 3001, host: 3001, auto_correct: true
  config.vm.network "forwarded_port", guest: 3002, host: 3002, auto_correct: true
  config.vm.network "forwarded_port", guest: 3003, host: 3003, auto_correct: true
  config.vm.network "forwarded_port", guest: 3004, host: 3004, auto_correct: true
  config.vm.network "forwarded_port", guest: 3005, host: 3005, auto_correct: true
  config.vm.network "forwarded_port", guest: 3006, host: 3006, auto_correct: true
  config.vm.network "forwarded_port", guest: 3007, host: 3007, auto_correct: true
  config.vm.network "forwarded_port", guest: 3008, host: 3008, auto_correct: true
  config.vm.network "forwarded_port", guest: 3009, host: 3009, auto_correct: true
  config.ssh.insert_key = false
  config.ssh.username = "vagrant"
  config.ssh.password = "vagrant"
  config.vm.synced_folder ".", "/vagrant",
    type: "virtualbox",
    owner: "www-data", group: "www-data"
end
