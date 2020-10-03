**contents**
  - [Red-Black Tree](#red-black-tree)
  - [특징](#특징)
  - [조건](#조건)
  - [Double Red 해결 전략](#double-red-해결-전략)

모든 노드가 자신의 왼쪽 서브트리에는 현재노드보다 작은 키값이, 오른쪽 서브트리에는 현재 노드보다 큰 값이 오는 규칙을 만족하는 이진트리이다.

`모든 왼쪽 자식들 <= n < 모든 오른쪽 자식들` (모든 노드 n에 대해서 반드시 참)
규칙 1. 이진 탐색 트리의 노드에 저장된 키는 유일하다.
규칙 2. 루트 노드의 키가 왼쪽 서브 트리를 구성하는 어떠한 노드의 키보다 크다.
규칙 3. 루트 노드의 키가 오른쪽 서브 트리를 구성하는 어떠한 노드의 키보다 작다.
규칙 4. 왼쪽과 오른쪽 서브트리도 이진 탐색 트리이다.

- 이진 탐색 트리의 탐색 연산은 **평균 O(log n)**의 시간 복잡도를 갖는다.
- 비교적 삽입, 삭제가 효율적인 자료구조이다.
- 이진 탐색 트리는 **Skewed Tree(편향 트리)**가 될 수 있다.
  - 저장 순서에 따라 계속 한 쪽으로만 노드가 추가되는 경우가 발생하기 때문.(**O(n)**)
  - 이를 해결하기 위해 **균형잡힌 이진검색트리**를 고안. 대표적인 것은 **레드블랙트리**와 **AVL트리**다.
- 이진 탐색 트리는 이진 탐색을 쉽게 할 수 있도록 만들어진 트리이다.

### Red-Black Tree

레드블랙 트리는 자가균형이진탐색 트리(self-balancing binary search tree)로써, 대표적으로 연관배열(associative array) 등을 구현하는데 쓰이는 자료구조이다.

### 특징

**balanced binary search tree**

- 이진 탐색 트리가 편향 트리가 될 경우를 방지하는 조건을 추가함
  - 균형이 잡혀 위 그림 같은 경우가 안나온다 -> 레드블랙트리의 높이는 logn에 바운드 된다 -> 레드블랙트리에서 삽입, 삭제, 검색 연산은 **O(logn)**의 시간복잡도를 가지게 된다.
- 자료의 삽입과 삭제, 검색에서 최악의 경우에도 일정한 실행 시간을 보장한다(worst-case guarantees).
  - 이는 실시간 처리와 같은 실행시간이 중요한 경우에 유용하게 쓰일 뿐만 아니라, 일정한 실행 시간을 보장하는 또 다른 자료구조를 만드는 데에도 쓸모가 있다. 예를 들면, 각종 기하학 계산에 쓰이는 많은 자료 구조들이 레드-블랙 트리를 기반으로 만들어져 있다.

### 조건

1. Root Property : 루트노드의 색깔은 검정(Black)이다.
   (추가되는 노드는 빨강이다)
2. External Property : 모든 external node들은 검정(Black)이다.
3. Internal Property : 빨강(Red)노드의 자식은 검정(Black)이다.
   == No Double Red(빨간색 노드가 연속으로 나올 수 없다.)
4. Depth Property : 모든 리프노드에서 Black Depth는 같다.
   == 리프노드에서 루트노드까지 가는 경로에서 만나는 블랙노드의 개수는 같다.
   (그냥 노드의 수는 다를 수 있음.)

위 조건들을 만족하게 되면, 레드블랙 트리는 가장 중요한 특성을 나타내게 된다. 루트 노드부터 가장 먼 경로까지의 거리가, 가장 가까운 경로까지의 거리의 두 배보다 항상 작다. 다시 말해 레드블랙 트리는 개략적으로 균형이 잡혀있다. 따라서, 삽입, 삭제, 검색 시 최악의 경우(worst-case)에서의 시간복잡도가 트리의 높이(깊이)에 따라 결정되기 때문에 보통의 이진검색 트리에 비해 효율적이다.

### Double Red 해결 전략

이렇게 연속해서 빨강 노드가 오게 되었을 때 해결 방법은 두가지 이다.

현재 insert된 노드의 uncle node(부모 노드의 형제 노드)를 w라고 할때,

- w==Black 👉 Restructuring
- w==Red 👉 Recoloring

즉, insert노드의 uncle node의 색을 기준으로 해결 전략이 달라지게 된다.

**Restructing**

1. 나(z)와 내 부모(v), 내 부모의 부모(Grand Parent)를 오름차순으로 정렬
2. 무조건 가운데 있는 값을 부모로 만들고 나머지 둘을 자식으로 만든다.
3. 올라간 가운데 있는 값을 검정(Black)으로 만들고 그 두자식들을 빨강(Red)로 만든다.

- Restructuring은 다른 서브트리에 영향을 끼치지 않기 때문에(4번조건) 한번의 과정으로 종료.
  - Restructing 전후의 Black 노드의 개수에 변화가 없기때문에 다른서브트리에 영향을 끼치지 않음
- Restructuring자체의 시간복잡도는 O(1)에 끝나지만, (순서결정시간 - 상수시간, 트리로 만드는시간 - 상수시간, 원래있던 노드들의 구조들을 바꿔주는 시간 - 상수시간)
  Restructuring은 어떤 노드를 insertion한 뒤 일어나므로 총 수행시간은 **O(logn)**이다. 지금 현재 노드가 들어갈 위치를 먼저 찾아야 하기 때문.

**Recoloring**

1. 현재 insert된 노드(c)의 부모(p)와 그 형제(u)를 검정(Black)으로 하고 Grand Parent(내 부모의 부모)를 빨강(Red)로 한다.
2. Grand Parent(내 부모의 부모)가 Root node가 아니었을 시 Double Red가 다시 발생 할 수 있다.

- Recoloring의 경우 Restructuring과 다르게 propagation될 수 있다. 최악의경우 Root까지 갈 수 있음.

**AVL Tree와 Red Black Tree 차이**

- AVL Tree가 Red Black Tree보다 빠른 Search를 제공
  - AVL Tree가 더 엄격한 Balanced를 유지하고 있기 때문
- Red Black Tree은 AVL Tree보다 빠른 삽입과 제거를 제공
  - AVL Tree보다 Balanced를 느슨하게 유지하고 있기 때문
- Red Black Tree는 AVL Tree보다 색깔을 저장하기 위해 더 많은 Space Complexity가 필요
- Red Black Tree는 대부분의 언어의 map, multimap, multiset에서 사용
- AVL tree는 조회에 속도가 중요한 Database에서 사용


