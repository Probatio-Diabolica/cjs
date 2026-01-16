int main() {
    int i = 0;
    int acc = 0;

    while (i < 10) {
        i = i + 1;
        if (i == 2) continue;
        if (i == 4) continue;
        if (i == 6) continue;
        if (i > 7) break;
        acc = acc + i;
    }

    return acc;
}
