if [ ! -f apis.json ]; then
    echo "apis.json not found"
    exit 1
fi

docker-compose up -d