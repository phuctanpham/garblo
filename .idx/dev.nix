{ pkgs, ... }:

{
  # Updated to a newer channel for 2025 compatibility
  channel = "stable-24.05"; 

  # STRICT SYNTAX: No commas between items!
  packages = [
    pkgs.nodejs_22
    pkgs.pnpm
    pkgs.gnupg
    pkgs.openssh
    pkgs.inetutils
    pkgs.sudo-rs
    pkgs.mongosh
    pkgs.xsel
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