FROM ubuntu:22.04 as builder

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates wget xz-utils build-essential cmake \
    libglib2.0-dev libgcrypt20-dev flex \
    yacc bison byacc libpcap-dev libssh-dev \
    libsystemd-dev libc-ares-dev libspeexdsp-dev

RUN wget https://2.na.dl.wireshark.org/src/wireshark-4.2.4.tar.xz -O /tmp/wireshark-4.2.4.tar.xz \
    && tar -xvf /tmp/wireshark-4.2.4.tar.xz -C /tmp \
    && cd /tmp/wireshark-4.2.4 \
    && cmake -S . -B build -DBUILD_wireshark=OFF -DBUILD_dftest=OFF -DCMAKE_INSTALL_PREFIX=/tmp/wireshark-4.2.4/install \
    && cmake --build build --target install -- -j$(nproc)

FROM ubuntu:22.04 as runtime

ENV PATH=$PATH:/tmp/wireshark-4.2.4/install/bin
ENV LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/tmp/wireshark-4.2.4/install/lib

COPY --from=builder /tmp/wireshark-4.2.4/install /tmp/wireshark-4.2.4/install
COPY --from=builder /usr/lib/aarch64-linux-gnu/libpcap.so /usr/lib/aarch64-linux-gnu/libpcap.so.0.8
COPY --from=builder /usr/lib/aarch64-linux-gnu/libglib-2.0.so.0.7200.4 /usr/lib/aarch64-linux-gnu/libglib-2.0.so.0
COPY --from=builder /usr/lib/aarch64-linux-gnu/libcares.so.2.5.1 /usr/lib/aarch64-linux-gnu/libcares.so.2
COPY --from=builder /usr/lib/aarch64-linux-gnu/libdbus-1.so.3.19.13 /usr/lib/aarch64-linux-gnu/libdbus-1.so.3
COPY --from=builder /usr/lib/aarch64-linux-gnu/libgmodule-2.0.so.0.7200.4 /usr/lib/aarch64-linux-gnu/libgmodule-2.0.so.0
COPY --from=builder /usr/lib/aarch64-linux-gnu/libssh.so.4.8.7 /usr/lib/aarch64-linux-gnu/libssh.so.4

RUN apt update && apt install python3 python3-pip pkg-config libhdf5-dev python3-h5py -y
RUN apt install tcpdump -y
RUN pip3 install starthinker

RUN pip3 install tensorflow pandas scipy

RUN apt install curl unzip -y
WORKDIR /app
COPY model_binary.h5 model_binary.h5
COPY execute_binary.py execute_binary.py

RUN pip3 install ijson

ENTRYPOINT ["python3", "execute_binary.py"]