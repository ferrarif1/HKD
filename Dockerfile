FROM rust:1.70 as builder

# 安装 Solana CLI v1.17.18
RUN curl -sSfL https://release.solana.com/v1.17.18/solana-install-init.sh | sh -s -- -b /usr/local/bin

# 安装 Anchor v0.29.0
RUN cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 anchor-cli --locked

WORKDIR /workspace
ENTRYPOINT ["bash"]
