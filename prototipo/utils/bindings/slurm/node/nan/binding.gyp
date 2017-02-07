{
 "targets": [ 
   { 
     "target_name": "slurm",
     "sources": [ "slurm.cc" ],
     "include_dirs": [ 
        "<!(node -e \"require('nan')\")"
      ],
      'cflags': [
            '<!(pkg-config slurm --cflags 2>/dev/null || echo "")',
      ],
      "libraries": [
            '<!(pkg-config slurm --libs 2>/dev/null || echo "")',
      ]
   }
 ]
}
