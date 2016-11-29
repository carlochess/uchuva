#!/usr/bin/env python

from suds.client import Client
import logging

logging.basicConfig(level=logging.INFO)
logging.getLogger('suds.client').setLevel(logging.DEBUG)

collector_url = 'http://localhost:8080/'
wsdl = 'file:///vagrant/soap/condorCollector.wsdl'

if __name__ == '__main__':
    collector = Client(wsdl, cache=None, location=collector_url)

    print collector.service.getVersionString()

