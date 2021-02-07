---
title: Ansible
slug: "/ansible"
order: 9
description: Ansible cheat sheet
---

## CLI

```bash
ansible-config view   # View the current config

# Ad-Hoc Commands
ansible -m ping all
ansible -m ping we*b
ansible -m ping web:lb       # In web OR in lb group, or both
ansible -m ping 'web:&lb'    # Both in the web and lb group
ansible -m ping 'web:!lb'    # In the web but not in the lb group

ansible web2 -m command -a "uptime"
ansible web2 -a "uptime"     # Command is the default module

ansible web -m copy -a "src=/etc/hosts dest=/temp/"
ansible lb:web -m copy -a "src=/etc/hosts dest=/temp/" # Both lb and web group

ansible web -m yum -a "name=ntp state=latest" -b       # Install ntp
ansible web -m yum -a "name=ntp state=absent" -b       # Delete ntp

ansible all -m shell -a "cat /etc/os-release"          # Shell

ansible web1 -m setup                                  # Returns a set of host Info
ansible all -m setup -a "filter=ansible_memtotal_mb"   # Get memory Info
ansible all -m setup -a "filter=ansible_*_mb"

ansible-playbook myplaybook.yml
ansible-playbook myplaybook.yml -b                     # Sudo
ansible-playbook myplaybook.yml -vvv                   # Detailed output
ansible-playbook myplaybook.yml --syntax-check
ansible-playbook myplaybook.yml -C                     # Dry-run
ansible-playbook file.yml —extra-vars "myint=4 myStr='abc'"

ansible-galaxy init web                                # Create a role
ansible-playbook root.yml

```

## Playbooks

```yaml
# Playbook with a two plays
- hosts: frontend
    # disable gathering facts, (the setup module)
	# speed up task & improve performance
	gather_facts: false
	tasks:
		- name: Installs Apache web server
		  yum:
			name: httpd
			state: installed
- hosts: backend
	tasks:
		- name: copies a configuration file
		  copy:
			src: /home/user1/config.cfg
			dest: /var/app1/config.cfg
```

## Modules

```yaml
- name: web servers
  hosts: web
  become: true
  tasks:
	  ### Yum ###
    - name: install apache
      yum:
        name: httpd, php  # optimal yum usage
        state: present
        update_cache: true
      yum: # non-optimal yum usage
        name: "{{ item }}"
        state: present
      loop: httpd, php
    ### Service ###
	- name: start apache service
      service:
        name: httpd
		  state: started
		  enable: yes
	### Copy ###
	- name: Copy files to remote locations
      copy:
        src: files/index.html
      dest: /var/www/html/index.html
        owner: root
        group: root
        mode: 0644
        backup: yes
	### Loop ###
	- name: Copy files to remote locations
		copy:
		  src: "{{ item }}"
        dest: /var/www/html/
		  owner: root
		  group: root
		  mode: 0644
		  backup: yes
      loop:
        - files/index.html
        - files/index.php
	### File ###
    - name: remove index.html
      file:
        path: /var/www/html/index.html
        state: absent
	### Lineinfile Module ###
	- name: configure httpd.conf
      lineinfile:
        path: "{{ apache_config_file }}"
        regexp: "^IncludeOptional"
        line: "IncludeOptional conf.d/*.conf"
    ### Debug ###
    - name: Rolling back
      debug:
		  # print msg
        msg: "Configuration file is not valid."
   ### Fail ###
    - name: Rolling back - ending playbook
      # Stop executing the playbook
      fail:
        msg: "Configuration file is not valid."
      when: result is failed
   ### Git ###
    - name: deploy files/index.php
      git:
        repo: "https://xx/ansible_essentials.git"
        dest: "/var/www/ansible/"
```

## Variables

```yaml
# Variables in the playbook
- hosts: all
  vars:
    myint: 15
    mystr: world
    USA: { Capital: 'Washington DC', President: 'Trump' }
    country: [Korea, China, Russia, India, Japan, Vietnam]
    fruits: [strawberry, pomegrenade, cherry]
  tasks:
    - name: Ansible looping trough list example
      debug:
        msg: "{{ item }}"
      loop:
        - "{{ fruits }}"
      debug:        # Loop thru dictionaries
        msg: "Key is {{ item.key }} value is {{ item.value}}"
      loop: "{{ USA|dict2items }}"
```

<br>

```yaml
# Varibles inside a separate var file
- hosts web1
  vars_files:
    - /var/external_vars.yml
  tasks:
   ...
---
# /var/external_vars.yml
somevar: somevalue
password: magic
```

<br>

```yaml
# User prompt
- hosts: web
  gather_facts: false
  vars_prompt:
    - name: "version"
      prompt: "Which version do you want to install?"
      private: no # value can be seen
      default: "2.4.6"
  tasks:
    - name: Ansible prompt example.
      debug:
        msg: "will install httpd-{{ version }}"
    - name: install specific apache version
      yum:
        name: "httpd-{{ version }}"
        state: present
```

<br>

```bash
# CLI
ansible-playbook file.yml —extra-vars "myint=4 myStr='abc'"
```

## Handlers

```yaml
# Will be only triggered once even if notified by multiple different tasks

- hosts: all
  become: true
  tasks:
    - name: copy configuration file
      copy:
        src: configfile.conf
        dest: /etc/configfile.conf
      notify:
        - restart memcached
  handlers: # Call conditionally
    - name: restart memcached
      service:
        name: memcached
        state: restarted
```

## Error handling

```yaml
# When a task fails on a remote machine, processing stops for that host in Ansible
tasks:
  - name: check configuration validity
    command: httpd -t
    # highlight-range{1}
    register: result # Store the return code. 0 if successed
    ignore_errors: yes # Continue executing the playbook
  - name: Rolling back - ending playbook
    fail: # Stop executing the playbook
      msg: "Configuration file is not valid."
    # highlight-range{1}
    when: result is failed
```

<br>

```yaml
# Block - Group multiple tasks in a block
tasks:
  - name: vhost config block
    # highlight-range{1}
    block:
      - name: copy vhost config
        copy:
          src: files/ansible_site.conf
          dest: "{{ vhost_config_file }}"
          owner: root
          group: root
          mode: 0644
        notify:
          - restart apache
      - name: check configuration validity
        command: httpd -t
    # highlight-range{1}
    rescue: # Execute if an error is encountered inside the block
      - name: remove bad virtual host configuration
        file:
          path: "{{ vhost_config_file }}"
          state: absent
      - name: Rolling back - ending playbook
        fail:
          msg: "Configuration file is not valid."
    # highlight-range{1}
    always:
      - debug:
        msg: "This always executes :)"
```

## Import & Include

```yaml
# Breaking tasks up into different files
# Process time:
#   - Import_tasks:  Preprocessed at the time playbooks are parsed
#   - Include_tasks: Processed during the execution of the playbook
# When conditional:
#   - Import_tasks:   All tasks get evaluated
#   - Include_tasks:  Applied only to the include task itself, not to indiviual tasks

- hosts: web
  name: Include task list in the play
  tasks:
    - include_tasks: tasks.yml
    - import_tasks: tasks.yml
---
# tasks.yml
- name: set fact task
  set_fact:
    mode: "on"
- name: debug task
  debug:
    msg: "mode is {{ mode }}"
```

## Roles

```bash
# Roles provide convention and organization over doing things with ansible
# Roles are Defifned with a predefined directory structure

ansible-galaxy init web
tree web
web
├── defaults
│   └── main.yml
├── files
│   ├── ansible_site.conf
│   └── db.php
├── handlers
│   └── main.yml
├── meta
│   └── main.yml
├── README.md
├── tasks
│   └── main.yml
├── templates
├── tests
│   ├── inventory
│   └── test.yml
└── vars
    └── main.yml

```

<br>

```yaml
# root.yml
- hosts: all
  become: true
  roles:
    - common
- hosts: web
  become: true
  roles:
    - web
- hosts: db
  become: true
  roles:
    - db
- hosts: lb
  become: true
  roles:
    - lb
```

## Inventory files

```bash
# List of hosts along with the groups they belong to
# Default location: /etc/ansible/hosts

[web]
webserver1.mydomain.com
webserver2

[web:vars]
ansible_host=webadmin

[all:vars]          # vars for all hosts
ansible_port=22

[database]
dbserver1 ansible_port=2222 ansible_user=dbadmin
dbserver2

[prod]
fileserver ansible_host=192.168.7.51

[europe]
webserver2

[asia-pac]
webserver1
fileserver

[region1:children]
europe
asia-pac

[testservers]
host[0:3]

[testservers]
168.1.222.[5:9]    # ip address range

dev-[a:c]
```

## Config files

```bash
# Default location: /etc/ansible/ansible.cfg
# Forks: Number of parallel processes to spawn, only 5 hosts will be configured at the same time (default value is 5)
# Usually memory is the bottleneck. 4G memory for every 100 nodes (roughly)

[defaults]
connection = smart
timeout = 60
inventory = /home/vagrant/ansible/hosts
host_key_checking = false
```
