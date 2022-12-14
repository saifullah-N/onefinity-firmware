#!/usr/bin/env python3

from setuptools import setup
import json

pkg = json.load(open('package.json', 'r'))

setup(
    name='bbctrl',
    version=pkg['version'],
    description='Onefinity Controller',
    long_description=open('README.md', 'rt').read(),
    maintainer='support@onefinitycnc.com',
    maintainer_email='support@onefinitycnc.com',
    platforms=['any'],
    license=pkg['license'],
    url=pkg['homepage'],
    package_dir={'': 'src/py'},
    packages=['bbctrl', 'camotics', 'iw_parse'],
    include_package_data=True,
    entry_points={'console_scripts': ['bbctrl = bbctrl:run']},
    scripts=[
        'installer/scripts/update-bbctrl',
        'installer/scripts/upgrade-bbctrl',
        'installer/scripts/sethostname',
        'installer/scripts/config-wifi',
        'installer/scripts/edit-config',
        'installer/scripts/edit-boot-config',
        'installer/scripts/browser',
    ],
    install_requires=[
        'tornado', 'sockjs-tornado', 'pyserial', 'pyudev', 'smbus2', 'watchdog'
    ],
    zip_safe=False,
)
