{ pkgs, ... }:

{
  # Updated to a newer channel for 2025 compatibility
  channel = "stable-24.05"; 

  # STRICT SYNTAX: No commas between items!
  packages = [
    pkgs.nodejs_20
    pkgs.pnpm
    pkgs.gnupg
    pkgs.openssh
    pkgs.inetutils
  ];

  # Environment variables
  env = {};

  # Project IDX specific configuration
  idx = {
    extensions = [
      # "vscodevim.vim"
    ];

    workspace = {
      # This replaces "startup.shell"
      onCreate = {
        install = "pnpm install";
      };
    };
  };
}