int main() {
    int x = 1;
    int sum = 0;

    while (x <= 5) {
        sum = sum + x;
        x = x + 1;
    }

    sum = 0;

    for (int i = 0; i< 10;i = i + 1)
    {
        sum = sum + i;
    }
    return sum;
}
