class ganglia ($controller = false) {

    class { "ganglia::packages":
        controller => $controller,
    }

    class {"ganglia::files":
        controller => $controller,
        require => Class["ganglia::packages"]
    }

    class {"ganglia::services":
        controller => $controller,
        require => Class["ganglia::files"]
    }

}
