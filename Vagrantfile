# -*- mode: ruby -*-
# vi: set ft=ruby :

# Dependencies.
require 'yaml'
require 'pathname'

# Recursively finds a file in all parent directories.
def get_path(filename)

  Pathname(__FILE__).ascend{ |directory|
    path = directory + "options.yml"; break path if path.file?
  }

end

# Parse the configuration file.
options = YAML.load_file(get_path("options.yml"))

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  # Default options for the VM.
  config.vm.box = "#{options['vagrant']['box']}"
  config.vm.box_url = "http://files.vagrantup.com/#{options['vagrant']['box']}.box"
  config.vm.network "forwarded_port", guest: 5000, host: options['vagrant']['http_port']

  config.vm.provider "virtualbox" do |virtualbox|
    virtualbox.memory = options['vagrant']['memory']
    virtualbox.cpus   = options['vagrant']['cpus']
  end

  # Run the playbooks.
  options['vagrant']['playbooks'].each do |playbook|

    config.vm.provision "ansible" do |ansible|

      if options['vagrant']['debug']
        ansible.verbose = "vvvv"
      end

      ansible.playbook = "ansible/playbooks/#{playbook}.yml"

    end

  end

end