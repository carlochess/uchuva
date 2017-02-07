{
  "targets": [
    {
      "target_name": "openlava",
      "sources": [ "openlava_wrap.cxx" ],
      "include_dirs": [ 
        "/opt/openlava-4.0/include"
      ],
      "libraries": [
            '-llsf', '-lnsl', '-lm','-Wl,-rpath,/opt/openlava-4.0/lib', '-L/opt/openlava-4.0/lib'
      ],
      "link_settings": {
          "libraries": [
              '-llsf', '-lnsl', '-lm', '-L/opt/openlava-4.0/lib'
          ]
      }
    }
  ]
}
